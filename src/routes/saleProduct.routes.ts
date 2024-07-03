import { validationToken } from "../middlewares/token";
import { Router, Request, Response, response } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreateSaleProduct, ICreateSaleProductDetail, SaleProductSunat } from "../interfaces/sale";
import { unescapeLeadingUnderscores } from "typescript";
import { newBoletaVenta } from "../scripts/bodyBoleta";
import { customerSunat } from "../interfaces/sunatDocuments";
import { statusNewDocument } from "../api/sunat/requests";
import fs from 'fs';
import { requestNewDocumentSunat } from "../api/sunat/requests";
import path from "path";
import PuppeteerHTMLPDF from "puppeteer-html-pdf";
import { generatePdf } from "../scripts/generatePdf";
import * as ejs from "ejs";

const router = Router();

router.post("/sale_product/register/",
    checkSchema({
        date: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo date"
        },
        paymentMethod: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo paymentMethod"
        },
        employee: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo empleado"
        },
        customer: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "error en el campo cliente"
        },
        saleDetails: {
            in: ["body"],
            isArray: true,
            notEmpty: true,
            errorMessage: "error en el campo detalles"
        },
        typeOfDocument: {
            in: ["body"],
            custom: {
                options: (value: string) => value === "Nota de venta" || "Boleta de venta"
            },
            isString: true,
            notEmpty: true,
            errorMessage: "Error en el campo tipo de documento"
        },
        customerAddress: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "error en el campo direccion"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        let saleIdTemp: number = 0;

        try {
            //! VALIDAR EN CUYO CASO SE DEBA ANULAR
            const customer = await appDataSource.getRepository("customer").findOne({ where: { person: { firstName: req.body["customer"] } }, relations: ["person"] });

            let customerToSunat: customerSunat;
            const listNewDetailsSale: ICreateSaleProductDetail[] = [];

            (!customer) ? customerToSunat = { firstName: "", lastName: "", dni: "00000000", address: "" } : customerToSunat = { firstName: customer["person"]["firstName"], lastName: customer["person"]["lastName"], dni: customer["person"]["dni"], address: req.body["customerAddress"] }

            const asignedEmployee = await appDataSource.getRepository("employee").findOne({ where: { person: { firstName: req.body["employee"] } } });
            const listProductToSunat: SaleProductSunat[] = [];

            const { ...newSaleProduct } = {
                date: req.body["date"],
                paymentMethod: req.body["paymentMethod"],
                employee: asignedEmployee,
                totalAmount: 0
            }

            const newProductSale: ICreateSaleProduct = <ICreateSaleProduct>(<unknown>{ ...newSaleProduct });
            const sale = await appDataSource.getRepository("product_sale").save(newProductSale);
            saleIdTemp = sale["id"];

            await Promise.all(req.body["saleDetails"].map(async (productDetail: string) => {
                const item: any = productDetail.split(".");

                const product: any = await appDataSource.getRepository("product").findOne({ where: { name: item[1] } });

                const { name, price } = product;
                sale["totalAmount"] += price * Number(item[0]);

                const { ...newDetailSaleProduct } = {
                    productSale: sale,
                    producto: product,
                    quantity: Number(item[0]),
                    subTotal: Number(item[0]) * price,
                    name: name,
                    price: price
                }

                await appDataSource.getRepository("product").update({ id: product["id"] }, { cantidad: product["cantidad"] - Number(item[0]) });
                const newDetail: ICreateSaleProductDetail = <ICreateSaleProductDetail>(<unknown>{ ...newDetailSaleProduct });
                //TODO LUEGO RECORRER LA LISTA LISTNEWDETAILSSALE PARA GUARDARLAS EN LA BD
                listNewDetailsSale.push(newDetail);
                listProductToSunat.push({ name: newDetail["name"], price: newDetail["price"], quantity: newDetail["quantity"], type: "NIU" });
            }));

            await appDataSource.getRepository("product_sale").update({ id: sale["id"] }, { totalAmount: sale["totalAmount"] });
            const responseProductSale = await appDataSource.getRepository("product_sale").findOne({ where: { id: sale["id"] }, relations: ["productSaleDetails"] });

            const productSale: ICreateSaleProduct = {
                date: responseProductSale!["date"],
                paymentMethod: responseProductSale!["paymentMethod"],
                employee: "",
                totalAmount: responseProductSale!["totalAmount"]
            }
            //! ACA ES PARA INFORMAR A SUNAT, BOLETA DE VENTA */ 
            if (req.body["typeOfDocument"] === "Boleta de venta") {
                const personaId = "66661e46c26328001570c686";
                const personaToken = "DEV_l3cScMg6vd063o4ocu8LFT4PMcL9XdObj7G1A4gLgGOUchc0pepbG1DyNDW1dDBj";
                const ruc = "10469186950";

                const { documentId, ...dataNewDocument } = await requestNewDocumentSunat(await newBoletaVenta(listProductToSunat, customerToSunat, productSale, personaId, personaToken, ruc));

                let status: string;
                let fileName: string;

                do {
                    const statusNewDocumentResponse = await statusNewDocument(documentId);
                    status = statusNewDocumentResponse["status"];
                    fileName = statusNewDocumentResponse["fileName"];
                } while (status === "PENDIENTE")

                if (status === "EXCEPCION") {
                    await appDataSource.getRepository("product_sale").delete({ id: sale["id"] });
                    return res.status(403).send({ message: "Ha ocurrido un error interno en sunat, intente nuevamente!", status: statusNewDocument });
                }

                await appDataSource.getRepository("product_sale").update({ id: sale["id"] }, { sunatDocumentId: documentId, fileNameDocumentSunat: fileName });

                if (status === "RECHAZADO") return res.status(403).send({ message: "El documento ha sido rechazado por sunat!, intente nuevamente", status: status });

                listNewDetailsSale.forEach(async (product: ICreateSaleProductDetail) => await appDataSource.getRepository("product_sale_detail").save(product));

                return res.send({
                    documentId: documentId,
                    pdfUrl: `https://back.apisunat.com/documents/${documentId}/getPDF/ticket58mm/${fileName}.pdf`
                });
            }

            listNewDetailsSale.forEach(async (product: ICreateSaleProductDetail) => await appDataSource.getRepository("product_sale_detail").save(product));

            return res.send({
                pdfUrl: `https://backend-sharon-3.onrender.com/sale_product/get_sale_note_by_code/${saleIdTemp}`,
                documentId: saleIdTemp
            });
        } catch (error) {
            await appDataSource.getRepository("product_sale").delete({ id: saleIdTemp });
            return res.status(500).send({ message: "error en el servidor!" });
        }
    }
);

router.get("/sale_product/get_sale_note_by_code/:code",
    param("code")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("parametro code esperado!"),
    async (req: Request, res: Response) => {
        try {
            const tempList: any[] = [];
            const dataSale = await appDataSource.getRepository("product_sale").findOne({ where: { id: req.params["code"] }, relations: ["productSaleDetails"] });
            if (!dataSale) return res.status(403).send({ message: "Error al obtener la venta!" });
            dataSale["productSaleDetails"].forEach((product: any) => tempList.push({ quantity: product["quantity"], description: product["name"], unitPrice: product["price"], totalPrice: product["price"] * product["quantity"] }));

            const data = {
                emissionDate: `${new Date(dataSale["date"]).toLocaleDateString("en-GB").split("/").reverse().map(part => part.padStart(2, '0')).join("-")} ${new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(dataSale["date"]))}`,
                code: dataSale["id"],
                products: tempList,
                opGravada: `${(dataSale["totalAmount"] / (1 + 0.18)).toFixed(2)}`,
                igv: `${(dataSale["totalAmount"] - dataSale["totalAmount"] / (1 + 0.18)).toFixed(2)}`,
                importeTotal: dataSale["totalAmount"].toFixed(2),
            }

            const pdf = await generatePdf(data);

            res.contentType('application/pdf');
            res.send(pdf);
        } catch (error) {
            console.error('Error fetching sale note:', error);
            res.status(500).send({ message: 'Internal server error' });
        }
    }
);


router.get("/sale_product/get_all/",
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const allData = await appDataSource.getRepository("product_sale").find({ relations: ["productSaleDetails"] });
            return res.send(allData);
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor" });
        }
    }
);

export default router;
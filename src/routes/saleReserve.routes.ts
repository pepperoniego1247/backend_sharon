import { validationToken } from "../middlewares/token";
import { Router, Response, Request } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreateSale, SaleProductSunat } from "../interfaces/sale";
import { requestNewDocumentSunat } from "../api/sunat/requests";
import { ReserveDetail } from "../entities/reserveDetail";
import { ICreateSaleDetail } from "../interfaces/saleDetail";
import { statusNewDocument } from "../api/sunat/requests";
import { newBoletaVenta } from "../scripts/bodyBoleta";
import { generatePdf } from "../scripts/generatePdf";

const router = Router();

//* date, paymentMethod, totalAmount, reservaId, asignedEmployeeId
router.post("/sale/register/:id",
    checkSchema({
        date: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "ocurrio un error en el campo date"
        },
        paymentMethod: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "error en el campo de pago"
        },
        asignedEmployee: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo empleado"
        },
        address: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "error en el campo direccion"
        },
        typeOfDocument: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo type of document"
        }
    }),
    param("id")
        .notEmpty()
        .isNumeric({ no_symbols: true }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        let id = "";
        try {
            const tempSaleDetail: ICreateSaleDetail[] = [];
            const reserveExists = await appDataSource.getRepository("reserve").findOne({ where: { id: req.params["id"] }, relations: ["asignedCustomer", "asignedCustomer.person"] });
            if (!reserveExists) return res.status(403).send({ message: "la reserva no existe!" });

            const saleAlreadyExists = await appDataSource.getRepository("sale").findOne({ where: { reserva: reserveExists } });
            if (saleAlreadyExists) return res.status(403).send({ message: "la venta de esta reserva ya esta realizada!" });

            const asignedEmployee = await appDataSource.getRepository("employee").findOne({ where: { id: req.body["asignedEmployee"] }, relations: ["person"] });
            if (!asignedEmployee) return res.status(403).send({ message: "el empleado no existe!" });

            const { ...newSale } = {
                date: req.body["date"],
                paymentMethod: req.body["paymentMethod"],
                totalAmount: 0,
                reserva: reserveExists,
                asignedEmployee: asignedEmployee
            }

            const newCreatedSale: ICreateSale = <ICreateSale>(<unknown>{ ...newSale });
            const sale = await appDataSource.getRepository("sale").save(newCreatedSale);
            id = sale["id"];

            const allDetails = await appDataSource.getRepository("reserve_detail").find({ where: { reserve: reserveExists }, relations: ["promotion", "service", "microServicio"] });
            let saleTotalAmount: number = 0;

            allDetails.forEach(async (detail: any) => {
                const { service, promotion, microServicio } = detail;
                let price: number = 0;
                let name: string = "";

                if (service) {
                    price = service["price"];
                    name = service["description"];
                }

                if (promotion) {
                    price = promotion["precio"];
                    name = promotion["name"]
                }

                if (microServicio) {
                    price = microServicio["price"];
                    name = microServicio["name"];
                };


                const { ...newSaleDetail } = {
                    reserveDetail: detail,
                    sale: sale,
                    subTotal: price,
                    name: name
                }

                saleTotalAmount += price;
                const newSaleDetailCreated: ICreateSaleDetail = <ICreateSaleDetail>(<unknown>{ ...newSaleDetail });
                tempSaleDetail.push(newSaleDetailCreated);
            });

            // await appDataSource.getRepository("sale_detail").save();
            if (req.body["typeOfDocument"] === "Boleta de venta") {
                const personaId = "66661e46c26328001570c686";
                const personaToken = "DEV_l3cScMg6vd063o4ocu8LFT4PMcL9XdObj7G1A4gLgGOUchc0pepbG1DyNDW1dDBj";
                const ruc = "10469186950";
                const temp: SaleProductSunat[] = [];

                tempSaleDetail.forEach((detail: ICreateSaleDetail) => temp.push({ name: detail["name"], price: detail["subTotal"], quantity: 1, type: "ZZ" }));

                const { asignedCustomer } = reserveExists;
                const { person } = asignedCustomer;
                const { documentId, ...dataNewDocument } = await requestNewDocumentSunat(await newBoletaVenta(temp, {
                    firstName: person["firstName"],
                    lastName: person["lastName"],
                    dni: person["dni"],
                    address: !req.body["address"] ? "" : req.body["address"]
                }, { date: sale["date"], paymentMethod: req.body["paymentMethod"], totalAmount: saleTotalAmount }, personaId, personaToken, ruc));

                let status: string;
                let fileName: string;

                do {
                    const statusNewDocumentResponse = await statusNewDocument(documentId);
                    status = statusNewDocumentResponse["status"];
                    fileName = statusNewDocumentResponse["fileName"];
                } while (status === "PENDIENTE")

                if (status === "EXCEPCION") {
                    await appDataSource.getRepository("sale").delete({ id: sale["id"] });
                    return res.status(403).send({ message: "Ha ocurrido un error interno en sunat, intente nuevamente!", status: statusNewDocument });
                }

                await appDataSource.getRepository("sale").update({ id: sale["id"] }, { sunatDocumentId: documentId, fileNameDocumentSunat: fileName });
                if (status === "RECHAZADO") return res.status(403).send({ message: "El documento ha sido rechazado por sunat!, intente nuevamente", status: status });
                tempSaleDetail.forEach(async (detail: ICreateSaleDetail) => { await appDataSource.getRepository("sale_detail").save(detail); });
                await appDataSource.getRepository("reserve").update({ id: req.params["id"] }, { activo: false });

                return res.send({
                    documentId: documentId,
                    pdfUrl: `https://back.apisunat.com/documents/${documentId}/getPDF/ticket58mm/${fileName}.pdf`
                });
            }

            tempSaleDetail.forEach(async (detail: ICreateSaleDetail) => { await appDataSource.getRepository("sale_detail").save(detail); });
            await appDataSource.getRepository("reserve").update({ id: req.params["id"] }, { activo: false });
            await appDataSource.getRepository("sale").update({ id: sale["id"] }, { totalAmount: saleTotalAmount });
            const saleN = await appDataSource.getRepository("sale").findOne({ where: { id: sale["id"] }, relations: ["asignedEmployee", "saleDetails"] });

            return res.send({
                pdfUrl: `https://backend-sharon-3.onrender.com/sale/get_sale_note_by_code/${saleN!["id"]}`,
                documentId: saleN!["id"]
            })
        } catch (error) {
            console.log(error);
            await appDataSource.getRepository("sale").delete({ id: id });
            return res.status(500).send({ message: "error interno en el servidor" });
        }
    }
);

router.get("/sale/get_all/",
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const allData = await appDataSource.getRepository("sale").find({ relations: ["asignedEmployee", "asignedEmployee.person", "saleDetails"] });
            return res.send(allData);
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor!" });
        }
    }
);

//! ARREGLAR LO DE ABAJO AHORA

router.get("/sale/get_sale_note_by_code/:code",
    param("code")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("parametro code esperado!"),
    async (req: Request, res: Response) => {
        try {
            const tempList: any[] = [];
            const dataSale = await appDataSource.getRepository("sale").findOne({ where: { id: req.params["code"] }, relations: ["saleDetails"] });
            if (!dataSale) return res.status(403).send({ message: "Error al obtener la venta!" });
            dataSale["saleDetails"].forEach((product: any) => tempList.push({ quantity: 1, description: product["name"], unitPrice: product["subTotal"], totalPrice: product["subTotal"] }));

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

export default router;
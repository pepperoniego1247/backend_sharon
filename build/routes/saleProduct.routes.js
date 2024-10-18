"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../middlewares/token");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middlewares/validateRequest");
const dataBase_1 = require("../dataBase");
const bodyBoleta_1 = require("../scripts/bodyBoleta");
const requests_1 = require("../api/sunat/requests");
const requests_2 = require("../api/sunat/requests");
const generatePdf_1 = require("../scripts/generatePdf");
const router = (0, express_1.Router)();
router.post("/sale_product/register/", (0, express_validator_1.checkSchema)({
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
            options: (value) => value === "Nota de venta" || "Boleta de venta"
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
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let saleIdTemp = 0;
    try {
        //! VALIDAR EN CUYO CASO SE DEBA ANULAR
        const customer = yield dataBase_1.appDataSource.getRepository("customer").findOne({ where: { person: { firstName: req.body["customer"] } }, relations: ["person"] });
        let customerToSunat;
        const listNewDetailsSale = [];
        (!customer) ? customerToSunat = { firstName: "", lastName: "", dni: "00000000", address: "" } : customerToSunat = { firstName: customer["person"]["firstName"], lastName: customer["person"]["lastName"], dni: customer["person"]["dni"], address: req.body["customerAddress"] };
        const asignedEmployee = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { person: { firstName: req.body["employee"] } } });
        const listProductToSunat = [];
        const newSaleProduct = __rest({
            date: req.body["date"],
            paymentMethod: req.body["paymentMethod"],
            employee: asignedEmployee,
            totalAmount: 0
        }, []);
        const newProductSale = Object.assign({}, newSaleProduct);
        const sale = yield dataBase_1.appDataSource.getRepository("product_sale").save(newProductSale);
        saleIdTemp = sale["id"];
        yield Promise.all(req.body["saleDetails"].map((productDetail) => __awaiter(void 0, void 0, void 0, function* () {
            const item = productDetail.split(".");
            const product = yield dataBase_1.appDataSource.getRepository("product").findOne({ where: { name: item[1] } });
            const { name, price } = product;
            sale["totalAmount"] += price * Number(item[0]);
            const newDetailSaleProduct = __rest({
                productSale: sale,
                producto: product,
                quantity: Number(item[0]),
                subTotal: Number(item[0]) * price,
                name: name,
                price: price
            }, []);
            yield dataBase_1.appDataSource.getRepository("product").update({ id: product["id"] }, { cantidad: product["cantidad"] - Number(item[0]) });
            const newDetail = Object.assign({}, newDetailSaleProduct);
            //TODO LUEGO RECORRER LA LISTA LISTNEWDETAILSSALE PARA GUARDARLAS EN LA BD
            listNewDetailsSale.push(newDetail);
            listProductToSunat.push({ name: newDetail["name"], price: newDetail["price"], quantity: newDetail["quantity"], type: "NIU" });
        })));
        yield dataBase_1.appDataSource.getRepository("product_sale").update({ id: sale["id"] }, { totalAmount: sale["totalAmount"] });
        const responseProductSale = yield dataBase_1.appDataSource.getRepository("product_sale").findOne({ where: { id: sale["id"] }, relations: ["productSaleDetails"] });
        const productSale = {
            date: responseProductSale["date"],
            paymentMethod: responseProductSale["paymentMethod"],
            employee: "",
            totalAmount: responseProductSale["totalAmount"]
        };
        //! ACA ES PARA INFORMAR A SUNAT, BOLETA DE VENTA */ 
        if (req.body["typeOfDocument"] === "Boleta de venta") {
            const personaId = "66661e46c26328001570c686";
            const personaToken = "DEV_l3cScMg6vd063o4ocu8LFT4PMcL9XdObj7G1A4gLgGOUchc0pepbG1DyNDW1dDBj";
            const ruc = "10469186950";
            const _a = yield (0, requests_2.requestNewDocumentSunat)(yield (0, bodyBoleta_1.newBoletaVenta)(listProductToSunat, customerToSunat, productSale, personaId, personaToken, ruc)), { documentId } = _a, dataNewDocument = __rest(_a, ["documentId"]);
            let status;
            let fileName;
            do {
                const statusNewDocumentResponse = yield (0, requests_1.statusNewDocument)(documentId);
                status = statusNewDocumentResponse["status"];
                fileName = statusNewDocumentResponse["fileName"];
            } while (status === "PENDIENTE");
            if (status === "EXCEPCION") {
                yield dataBase_1.appDataSource.getRepository("product_sale").delete({ id: sale["id"] });
                return res.status(403).json({ message: "Ha ocurrido un error interno en sunat, intente nuevamente!", status: requests_1.statusNewDocument });
            }
            yield dataBase_1.appDataSource.getRepository("product_sale").update({ id: sale["id"] }, { sunatDocumentId: documentId, fileNameDocumentSunat: fileName });
            if (status === "RECHAZADO")
                return res.status(403).json({ message: "El documento ha sido rechazado por sunat!, intente nuevamente", status: status });
            listNewDetailsSale.forEach((product) => __awaiter(void 0, void 0, void 0, function* () { return yield dataBase_1.appDataSource.getRepository("product_sale_detail").save(product); }));
            return res.send({
                documentId: documentId,
                pdfUrl: `https://back.apisunat.com/documents/${documentId}/getPDF/ticket58mm/${fileName}.pdf`
            });
        }
        listNewDetailsSale.forEach((product) => __awaiter(void 0, void 0, void 0, function* () { return yield dataBase_1.appDataSource.getRepository("product_sale_detail").save(product); }));
        return res.send({
            pdfUrl: `http://localhost:4000/sale_product/get_sale_note_by_code/${saleIdTemp}`,
            documentId: saleIdTemp
        });
    }
    catch (error) {
        yield dataBase_1.appDataSource.getRepository("product_sale").delete({ id: saleIdTemp });
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
router.get("/sale_product/get_sale_note_by_code/:code", (0, express_validator_1.param)("code")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("parametro code esperado!"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tempList = [];
        const dataSale = yield dataBase_1.appDataSource.getRepository("product_sale").findOne({ where: { id: req.params["code"] }, relations: ["productSaleDetails"] });
        if (!dataSale)
            return res.status(403).send({ message: "Error al obtener la venta!" });
        dataSale["productSaleDetails"].forEach((product) => tempList.push({ quantity: product["quantity"], description: product["name"], unitPrice: product["price"], totalPrice: product["price"] * product["quantity"] }));
        const data = {
            emissionDate: `${new Date(dataSale["date"]).toLocaleDateString("en-GB").split("/").reverse().map(part => part.padStart(2, '0')).join("-")} ${new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(dataSale["date"]))}`,
            code: dataSale["id"],
            products: tempList,
            opGravada: `${(dataSale["totalAmount"] / (1 + 0.18)).toFixed(2)}`,
            igv: `${(dataSale["totalAmount"] - dataSale["totalAmount"] / (1 + 0.18)).toFixed(2)}`,
            importeTotal: dataSale["totalAmount"].toFixed(2),
        };
        const pdf = yield (0, generatePdf_1.generatePdf)(data);
        res.contentType('application/pdf');
        res.send(pdf);
    }
    catch (error) {
        console.error('Error fetching sale note:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
}));
router.get("/sale_product/get_all/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield dataBase_1.appDataSource.getRepository("product_sale").find({ relations: ["productSaleDetails"] });
        return res.send(allData);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor" });
    }
}));
exports.default = router;

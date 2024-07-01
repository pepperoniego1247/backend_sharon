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
const requests_1 = require("../api/sunat/requests");
const requests_2 = require("../api/sunat/requests");
const bodyBoleta_1 = require("../scripts/bodyBoleta");
const generatePdf_1 = require("../scripts/generatePdf");
const router = (0, express_1.Router)();
//* date, paymentMethod, totalAmount, reservaId, asignedEmployeeId
router.post("/sale/register/:id", (0, express_validator_1.checkSchema)({
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
}), (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true }), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = "";
    try {
        const tempSaleDetail = [];
        const reserveExists = yield dataBase_1.appDataSource.getRepository("reserve").findOne({ where: { id: req.params["id"] }, relations: ["asignedCustomer", "asignedCustomer.person"] });
        if (!reserveExists)
            return res.status(403).send({ message: "la reserva no existe!" });
        const saleAlreadyExists = yield dataBase_1.appDataSource.getRepository("sale").findOne({ where: { reserva: reserveExists } });
        if (saleAlreadyExists)
            return res.status(403).send({ message: "la venta de esta reserva ya esta realizada!" });
        const asignedEmployee = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { id: req.body["asignedEmployee"] }, relations: ["person"] });
        if (!asignedEmployee)
            return res.status(403).send({ message: "el empleado no existe!" });
        const newSale = __rest({
            date: req.body["date"],
            paymentMethod: req.body["paymentMethod"],
            totalAmount: 0,
            reserva: reserveExists,
            asignedEmployee: asignedEmployee
        }, []);
        const newCreatedSale = Object.assign({}, newSale);
        const sale = yield dataBase_1.appDataSource.getRepository("sale").save(newCreatedSale);
        id = sale["id"];
        const allDetails = yield dataBase_1.appDataSource.getRepository("reserve_detail").find({ where: { reserve: reserveExists }, relations: ["promotion", "service", "microServicio"] });
        let saleTotalAmount = 0;
        allDetails.forEach((detail) => __awaiter(void 0, void 0, void 0, function* () {
            const { service, promotion, microServicio } = detail;
            let price = 0;
            let name = "";
            if (service) {
                price = service["price"];
                name = service["description"];
            }
            if (promotion) {
                price = promotion["precio"];
                name = promotion["name"];
            }
            if (microServicio) {
                price = microServicio["price"];
                name = microServicio["name"];
            }
            ;
            const newSaleDetail = __rest({
                reserveDetail: detail,
                sale: sale,
                subTotal: price,
                name: name
            }, []);
            saleTotalAmount += price;
            const newSaleDetailCreated = Object.assign({}, newSaleDetail);
            tempSaleDetail.push(newSaleDetailCreated);
        }));
        // await appDataSource.getRepository("sale_detail").save();
        if (req.body["typeOfDocument"] === "Boleta de venta") {
            const personaId = "66661e46c26328001570c686";
            const personaToken = "DEV_l3cScMg6vd063o4ocu8LFT4PMcL9XdObj7G1A4gLgGOUchc0pepbG1DyNDW1dDBj";
            const ruc = "10469186950";
            const temp = [];
            tempSaleDetail.forEach((detail) => temp.push({ name: detail["name"], price: detail["subTotal"], quantity: 1, type: "ZZ" }));
            const { asignedCustomer } = reserveExists;
            const { person } = asignedCustomer;
            const _a = yield (0, requests_1.requestNewDocumentSunat)(yield (0, bodyBoleta_1.newBoletaVenta)(temp, {
                firstName: person["firstName"],
                lastName: person["lastName"],
                dni: person["dni"],
                address: !req.body["address"] ? "" : req.body["address"]
            }, { date: sale["date"], paymentMethod: req.body["paymentMethod"], totalAmount: saleTotalAmount }, personaId, personaToken, ruc)), { documentId } = _a, dataNewDocument = __rest(_a, ["documentId"]);
            let status;
            let fileName;
            do {
                const statusNewDocumentResponse = yield (0, requests_2.statusNewDocument)(documentId);
                status = statusNewDocumentResponse["status"];
                fileName = statusNewDocumentResponse["fileName"];
            } while (status === "PENDIENTE");
            if (status === "EXCEPCION") {
                yield dataBase_1.appDataSource.getRepository("sale").delete({ id: sale["id"] });
                return res.status(403).send({ message: "Ha ocurrido un error interno en sunat, intente nuevamente!", status: requests_2.statusNewDocument });
            }
            yield dataBase_1.appDataSource.getRepository("sale").update({ id: sale["id"] }, { sunatDocumentId: documentId, fileNameDocumentSunat: fileName });
            if (status === "RECHAZADO")
                return res.status(403).send({ message: "El documento ha sido rechazado por sunat!, intente nuevamente", status: status });
            tempSaleDetail.forEach((detail) => __awaiter(void 0, void 0, void 0, function* () { yield dataBase_1.appDataSource.getRepository("sale_detail").save(detail); }));
            yield dataBase_1.appDataSource.getRepository("reserve").update({ id: req.params["id"] }, { activo: false });
            return res.send({
                documentId: documentId,
                pdfUrl: `https://back.apisunat.com/documents/${documentId}/getPDF/ticket58mm/${fileName}.pdf`
            });
        }
        tempSaleDetail.forEach((detail) => __awaiter(void 0, void 0, void 0, function* () { yield dataBase_1.appDataSource.getRepository("sale_detail").save(detail); }));
        yield dataBase_1.appDataSource.getRepository("reserve").update({ id: req.params["id"] }, { activo: false });
        yield dataBase_1.appDataSource.getRepository("sale").update({ id: sale["id"] }, { totalAmount: saleTotalAmount });
        const saleN = yield dataBase_1.appDataSource.getRepository("sale").findOne({ where: { id: sale["id"] }, relations: ["asignedEmployee", "saleDetails"] });
        return res.send({
            pdfUrl: `https://backend-sharon-3.onrender.com/sale/get_sale_note_by_code/${saleN["id"]}`,
            documentId: saleN["id"]
        });
    }
    catch (error) {
        console.log(error);
        yield dataBase_1.appDataSource.getRepository("sale").delete({ id: id });
        return res.status(500).send({ message: "error interno en el servidor" });
    }
}));
router.get("/sale/get_all/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield dataBase_1.appDataSource.getRepository("sale").find({ relations: ["asignedEmployee", "asignedEmployee.person", "saleDetails"] });
        return res.send(allData);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
//! ARREGLAR LO DE ABAJO AHORA
router.get("/sale/get_sale_note_by_code/:code", (0, express_validator_1.param)("code")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("parametro code esperado!"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tempList = [];
        const dataSale = yield dataBase_1.appDataSource.getRepository("sale").findOne({ where: { id: req.params["code"] }, relations: ["saleDetails"] });
        if (!dataSale)
            return res.status(403).send({ message: "Error al obtener la venta!" });
        dataSale["saleDetails"].forEach((product) => tempList.push({ quantity: 1, description: product["name"], unitPrice: product["subTotal"], totalPrice: product["subTotal"] }));
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
exports.default = router;

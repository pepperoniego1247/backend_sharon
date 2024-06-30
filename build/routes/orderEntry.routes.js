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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middlewares/validateRequest");
const dataBase_1 = require("../dataBase");
const router = (0, express_1.Router)();
router.post("/order_entry/register/", (0, express_validator_1.checkSchema)({
    date: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo date no puede estar vacio!"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "el campo activo esta mal!"
    },
    employee: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "error en el campo empleado!"
    },
    orderEntryDetails: {
        in: ["body"],
        isArray: true,
        notEmpty: true,
        errorMessage: "error en el campo detalle!"
    },
    provider: {
        in: ["body"],
        isArray: true,
        notEmpty: true,
        errorMessage: "el campo providers tuvo un error!"
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { person: { firstName: req.body["employee"] } }, relations: ["person"] });
        if (!employee)
            return res.status(403).send({ message: "el empleado no existe!" });
        const provider = yield dataBase_1.appDataSource.getRepository("provider").findOne({ where: { name: req.body["provider"] } });
        if (!provider)
            return res.status(403).send({ message: "el proveedor no existe!" });
        const { orderEntryDetails } = req.body;
        delete req.body["orderEntryDetails"];
        const newOrderEntry = __rest({
            date: req.body["date"],
            activo: req.body["activo"],
            employee: employee,
            provider: provider
        }, []);
        const createdOrderEntry = Object.assign({}, newOrderEntry);
        const orderEntry = yield dataBase_1.appDataSource.getRepository("order_entry").save(createdOrderEntry);
        for (let detail of orderEntryDetails) {
            const product = yield dataBase_1.appDataSource.getRepository("product").findOne({ where: { name: detail.name } });
            if (!product)
                return res.status(403).send({ message: "el producto no existe!" });
            if (detail.quantity < 0)
                return res.status(403).send({ message: "la cantidad no puede ser menor que cerapio!!!" });
            const newDetail = __rest({
                name: detail.name,
                quantity: detail.quantity,
                orderEntry: orderEntry,
                product: product
            }, []);
            const createDetail = Object.assign({}, newDetail);
            const orderDetail = yield dataBase_1.appDataSource.getRepository("order_entry_detail").save(createDetail);
            if (!orderDetail)
                return res.status(403).send({ message: "Error en el detalle" });
            let entrada = Number(product.cantidad) + Number(orderDetail.quantity);
            const updateData = yield dataBase_1.appDataSource.getRepository("product").update(product.id, { cantidad: entrada });
            if (!updateData)
                return res.status(403).send({ message: "Error al ingresar la cantidad" });
        }
        return res.send(orderEntry);
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}));
router.get("/order_entry/get_all/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield dataBase_1.appDataSource.getRepository("order_entry").find({ relations: ["provider", "employee.person"], where: { activo: true } });
        return res.send(allData);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}));
router.get("/order_entry/get_by_id/:id", (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el parametro"), validateRequest_1.validateReq, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Order = yield dataBase_1.appDataSource.getRepository("order_entry").findOne({ relations: ["orderEntryDetails"], where: { id: req.params["id"] } });
        return res.send(Order);
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}));
router.put("/order_entry/disable_by_id/:id", (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el parametro"), validateRequest_1.validateReq, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params["id"];
        const Order = yield dataBase_1.appDataSource.getRepository("order_entry").findOne({ relations: ["orderEntryDetails"], where: { id: id } });
        if (!Order)
            return res.status(403).send({ message: "la orden no existe!" });
        if (Order.activo == false)
            return res.status(403).send({ message: "la orden ya está deshabilitadaaaaa!" });
        const orderEntryDetails = Order["orderEntryDetails"];
        console.log(orderEntryDetails);
        for (let detail of orderEntryDetails) {
            const product = yield dataBase_1.appDataSource.getRepository("product").findOne({ where: { name: detail.name } });
            if (!product)
                return res.status(403).send({ message: "el producto no existe!" });
            if (Number(product.cantidad) < Number(detail.quantity))
                return res.status(403).send({ message: "el stock del producto no puede ser negativo" });
        }
        for (let detail of orderEntryDetails) {
            const product = yield dataBase_1.appDataSource.getRepository("product").findOne({ where: { name: detail.name } });
            if (!product)
                return res.status(403).send({ message: "el producto no existe!" });
            if (Number(product.cantidad) < Number(detail.quantity))
                return res.status(403).send({ message: "el stock del producto no puede ser negativo" });
            let nuevo = Number(product.cantidad) - Number(detail.quantity);
            const updateData = yield dataBase_1.appDataSource.getRepository("product").update(product.id, { cantidad: nuevo });
            if (!updateData)
                return res.status(403).send({ message: "Error al ingresar la cantidad" });
        }
        const updateActive = yield dataBase_1.appDataSource.getRepository("order_entry").update(Order.id, { activo: false });
        if (!updateActive)
            return res.status(403).send({ message: "error al deshabilitar!" });
        return res.send(Order);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}));
exports.default = router;

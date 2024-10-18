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
router.post("/payment/register/", (0, express_validator_1.checkSchema)({
    date: {
        in: ["body"],
        isDate: true,
        notEmpty: true,
        errorMessage: "el campo date no puede estar vacio!"
    },
    employee: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "error en el campo empleado!"
    },
    total: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en la cantidad total"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "error en el campo activo"
    },
    paymentDetails: {
        in: ["body"],
        isArray: true,
        notEmpty: true,
        errorMessage: "error en el detashe"
    }
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { person: { firstName: req.body["employee"] }, role: { name: "Administrador" } }, relations: ["person"] });
        if (!employee)
            return res.status(403).send({ message: "el administrador no existe!" });
        const { paymentDetails } = req.body;
        delete req.body["paymentDetails"];
        const newPayment = __rest({
            date: req.body["date"],
            employee: employee,
            total: req.body["total"],
            activo: req.body["activo"]
        }, []);
        const createdPayment = Object.assign({}, newPayment);
        const payment = yield dataBase_1.appDataSource.getRepository("payment").save(createdPayment);
        paymentDetails.forEach((detail) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const employee = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { person: { firstName: detail.name } }, relations: ["person", "role"] });
            if (!employee)
                return res.status(403).send({ message: "el empleado no existe!" });
            const extra = (_a = detail.extra) !== null && _a !== void 0 ? _a : 0;
            const { role } = employee;
            const newDetail = __rest({
                name: detail.name,
                lastName: employee.person.lastName,
                payment: payment,
                employeeId: employee.id,
                extra: extra,
                totalAmount: parseFloat(role.payment) + parseFloat(extra)
            }, []);
            const createDetail = Object.assign({}, newDetail);
            const payment_detail = yield dataBase_1.appDataSource.getRepository("payment_detail").save(createDetail);
            if (!payment_detail)
                return res.status(403).send({ message: "Error en el detalle" });
        }));
        return res.send(payment);
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}));
router.get("/payment/get_all/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield dataBase_1.appDataSource.getRepository("payment").find({ relations: ["employee.person"] });
        return res.send(allData);
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}));
router.get("/payment/get_by_id/:id", (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el parametro"), validateRequest_1.validateReq, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Payment = yield dataBase_1.appDataSource.getRepository("payment").findOne({ relations: ["paymentDetails"], where: { id: req.params["id"] } });
        return res.send(Payment);
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}));
router.put("/payment/disable_by_id/:id", (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el parametro"), validateRequest_1.validateReq, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params["id"];
        const Payment = yield dataBase_1.appDataSource.getRepository("payment").findOne({ relations: ["paymentDetails"], where: { id: id } });
        if (!Payment)
            return res.status(403).send({ message: "el pago no existe!" });
        if (Payment.activo == false)
            return res.status(403).send({ message: "el pago  ya está deshabilitado!" });
        const updateActive = yield dataBase_1.appDataSource.getRepository("payment").update(Payment.id, { activo: false });
        if (!updateActive)
            return res.status(403).send({ message: "error al deshabilitar!" });
        return res.send(Payment);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}));
exports.default = router;

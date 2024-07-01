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
const token_1 = require("../middlewares/token");
const router = (0, express_1.Router)();
router.post("/role/register/", (0, express_validator_1.checkSchema)({
    name: {
        in: ["body"],
        isAlphanumeric: true,
        notEmpty: true,
        errorMessage: "datos invalidos en el nombre"
    },
    payment: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo de pago"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield dataBase_1.appDataSource.getRepository("role").findOne({ where: { name: req.body["name"] } });
        if (role)
            return res.status(403).send({ message: "el rol ya existe!" });
        const tempRole = __rest(req.body, []);
        const newRole = Object.assign({}, tempRole);
        const data = yield dataBase_1.appDataSource.getRepository("role").save(newRole);
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "ha ocurrido un error interno" });
    }
}));
router.get("/role/get_all/", token_1.validationToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("role").find();
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor" });
    }
}));
router.get("/role/get_by_id/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro id es erroneo"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield dataBase_1.appDataSource.getRepository("role").findOne({ where: { id: req.params["id"] } });
    if (!data)
        return res.status(403).send({ message: "el role no existe!" });
    return res.send(data);
}));
router.put("/role/update_by_id/:id", (0, express_validator_1.checkSchema)({
    name: {
        notEmpty: true,
        isAlpha: true,
        errorMessage: "error en el campo name!"
    },
    payment: {
        isNumeric: true,
        notEmpty: true,
        errorMessage: "el campo pago no puede tener valores invalidos!"
    }
}), (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro id es erroneo"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("role").findOne({ where: { id: req.params["id"] } });
        if (!data)
            return res.status(403).send({ message: "el role no existe!" });
        const updateRole = __rest(req.body, []);
        const newUpdateRole = Object.assign({}, updateRole);
        const { name, payment } = newUpdateRole;
        const response = yield dataBase_1.appDataSource.getRepository("role").update({ id: data["id"] }, { name: name, payment: payment });
        return res.send(response);
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor" });
    }
}));
exports.default = router;

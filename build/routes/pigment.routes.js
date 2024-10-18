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
router.post("/pigment/register/", (0, express_validator_1.checkSchema)({
    nombre: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "error en el campo nombre"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pigmentAlreadyExists = yield dataBase_1.appDataSource.getRepository("pigment").findOne({ where: { nombre: req.body["nombre"] } });
        if (pigmentAlreadyExists)
            return res.status(403).send({ message: "el pigmento ya existe!" });
        const newPigment = __rest({
            nombre: req.body["nombre"],
            activo: true
        }, []);
        const newPigmentCreated = Object.assign({}, newPigment);
        const pigment = yield dataBase_1.appDataSource.getRepository("pigment").save(newPigmentCreated);
        return res.send(pigment);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
router.get("/pigment/get_all/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield dataBase_1.appDataSource.getRepository("pigment").find();
        return res.send(allData);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
router.put("/pigment/update_by_id/:id", (0, express_validator_1.checkSchema)({
    nombre: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "error en el campo nombre"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "error en el campo activo"
    }
}), (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el parametro id"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pigmentExists = yield dataBase_1.appDataSource.getRepository("pigment").find({ where: { id: req.params["id"] } });
        if (!pigmentExists)
            return res.status(403).send({ message: "no existe el pigmento!" });
        const newUpdatePigment = __rest(req.body, []);
        const newPigmentUpdated = Object.assign({}, newUpdatePigment);
        const update = yield dataBase_1.appDataSource.getRepository("pigment").update({ id: req.params["id"] }, Object.assign({}, newPigmentUpdated));
        return res.send(update);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
exports.default = router;

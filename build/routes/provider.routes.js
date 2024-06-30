"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
const token_1 = require("../middlewares/token");
const router = (0, express_1.Router)();
dotenv.config();
router.post("/provider/register/", (0, express_validator_1.checkSchema)({
    ruc: {
        in: ["body"],
        isNumeric: true,
        optional: { options: { nullable: true, checkFalsy: true } },
        errorMessage: "datos invalidos en el ruc"
    },
    address: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isString: true,
        errorMessage: "datos invalidos en la direccion"
    },
    name: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "datos invalidos en el nombre"
    },
    phoneNumber: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isNumeric: true,
        errorMessage: "datos invalidos en el telefono"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        errorMessage: "datos invalidos en activo"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = yield dataBase_1.appDataSource.getRepository("provider").findOne({ where: { name: req.body["name"] } });
        if (provider)
            return res.status(403).send({ message: "el proveedor ya existe!" });
        const newProvider = __rest(req.body, []);
        const newProviderData = Object.assign({}, newProvider);
        const data = yield dataBase_1.appDataSource.getRepository("provider").save(newProviderData);
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "ha ocurrido un error interno", error: error });
    }
}));
router.get("/provider/get_all/", token_1.validationToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("provider").find();
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor" });
    }
}));
router.get("/provider/get_by_id/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro id es erroneo"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield dataBase_1.appDataSource.getRepository("provider").findOne({ where: { id: req.params["id"] } });
    if (!data)
        return res.status(403).send({ message: "el proveedor no existe!" });
    return res.send(data);
}));
router.put("/provider/update_by_id/:id", (0, express_validator_1.checkSchema)({
    ruc: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isNumeric: true,
        errorMessage: "datos invalidos en el ruc"
    },
    address: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isString: true,
        errorMessage: "datos invalidos en la direccion"
    },
    name: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "datos invalidos en el nombre"
    },
    phoneNumber: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isNumeric: true,
        errorMessage: "datos invalidos en el telefono"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        errorMessage: "datos invalidos en activo"
    }
}), (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro id es erroneo"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("provider").findOne({ where: { id: req.params["id"] } });
        if (!data)
            return res.status(403).send({ message: "el proveedor no existe!" });
        const updateProvider = __rest(req.body, []);
        const newUpdateProvider = Object.assign({}, updateProvider);
        const { ruc, address, name, phoneNumber, activo } = newUpdateProvider;
        const response = yield dataBase_1.appDataSource.getRepository("provider").update({ id: data["id"] }, { ruc: ruc, address: address, name: name, phoneNumber: phoneNumber, activo: activo });
        return res.send(response);
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor" });
    }
}));
exports.default = router;

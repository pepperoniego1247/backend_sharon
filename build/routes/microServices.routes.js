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
const dotenv = __importStar(require("dotenv"));
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middlewares/validateRequest");
const dataBase_1 = require("../dataBase");
const token_1 = require("../middlewares/token");
const router = (0, express_1.Router)();
dotenv.config();
router.post("/micro_services/register/", (0, express_validator_1.checkSchema)({
    name: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "ingrese datos validos para el nombre"
    },
    price: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "el campo de precio no puede estar vacio"
    },
    activo: {
        in: ["body"],
        custom: {
            options: (value) => value === true || value === false
        },
        errorMessage: "el estado deber ser un booleano",
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const microService = yield dataBase_1.appDataSource.getRepository("micro_service").findOne({ where: { name: req.body["name"] } });
        if (microService)
            return res.status(403).send({ message: "el microservicio ya existe" });
        const newMicroService = __rest(req.body, []);
        const newMicroServiceData = Object.assign({}, newMicroService);
        const data = yield dataBase_1.appDataSource.getRepository("micro_service").save(newMicroServiceData);
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "ha ocurrido un error interno", error: error });
    }
}));
router.get("/micro_services/get_all/", token_1.validationToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("micro_service").find({ relations: ["service"] });
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor" });
    }
}));
router.put("/micro_services/update_by_id/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro id es erroneo"), (0, express_validator_1.checkSchema)({
    name: {
        in: ["body"],
        isString: true,
        errorMessage: "ha ocurrido un error en el campo nombre"
    },
    price: {
        in: ["body"],
        isNumeric: true,
        optional: true,
        errorMessage: "ha ocurrido un error en el campo precio"
    },
    activo: {
        in: ["body"],
        custom: {
            options: (value) => value === true || value === false
        },
        errorMessage: "el estado deber ser un booleano",
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("micro_service").findOne({ where: { id: req.params["id"] } });
        if (!data)
            return res.status(401).send({ message: "el microservicio no existe!!" });
        (req.body["service"] == null) ? req.body["service"] = "" : null;
        const asignedService = yield dataBase_1.appDataSource.getRepository("service").findOne({ where: { description: req.body["service"] } });
        (asignedService) ? req.body["service"] = asignedService : req.body["service"] = null;
        const updateMicroService = __rest(req.body, []);
        const newUpdatedMicroServices = Object.assign({}, updateMicroService);
        const { name, price, service, activo } = newUpdatedMicroServices;
        const response = yield dataBase_1.appDataSource.getRepository("micro_service").update({ id: req.params["id"] }, { name: name, price: price, service: service, activo: activo });
        return res.send(response);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
exports.default = router;

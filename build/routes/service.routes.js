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
const router = (0, express_1.Router)();
router.post("/services/register/", 
//!! CAMBIAR PARA QUE SE REGISTRE ESTO Y POR UN ARRAY CON MICROSERVICIOS
(0, express_validator_1.checkSchema)({
    description: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "error en el campo descripcion!"
    },
    price: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo precio!"
    },
    microServices: {
        in: ["body"],
        isArray: true,
        notEmpty: true,
        errorMessage: "error en el campo micro servicios"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("service").findOne({ where: { description: req.body["description"], activo: true } });
        if (data)
            return res.status(403).send({ message: "el servicio ya existe" });
        const newService = __rest(req.body, []);
        const newServiceCreated = Object.assign({}, newService);
        const response = yield dataBase_1.appDataSource.getRepository("service").save(newServiceCreated);
        req.body["microServices"].forEach((name) => __awaiter(void 0, void 0, void 0, function* () {
            yield dataBase_1.appDataSource.getRepository("micro_service").update({ name: name }, { service: response });
        }));
        return res.send(response);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor: ", error });
    }
}));
router.get("/services/get_all/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("service").find({ relations: ["microServices"] });
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor" });
    }
}));
router.put("/services/update_by_id/:id", (0, express_validator_1.checkSchema)({
    description: {
        in: ["body"],
        isAlphanumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo descripcion!"
    },
    price: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo precio!"
    },
    microServices: {
        isArray: true,
        notEmpty: true,
        errorMessage: "error en el campo services"
    }
}), (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("el id es invalido!"), token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceAlreadyExists = yield dataBase_1.appDataSource.getRepository("service").findOne({ where: { id: req.params["id"], activo: true } });
        if (!serviceAlreadyExists)
            return res.status(403).send({ message: "el servicio no existe!" });
        const { microServices } = req.body;
        delete req.body["microServices"];
        const newUpdatedService = Object.assign({}, req.body);
        const updatedService = yield dataBase_1.appDataSource.getRepository("service").update({ id: req.params["id"] }, Object.assign({}, newUpdatedService));
        microServices.forEach((service) => __awaiter(void 0, void 0, void 0, function* () {
            const micro = yield dataBase_1.appDataSource.getRepository("micro_service").find({ where: { name: service } });
            if (micro["service"])
                return res.status(403).send({ message: "error al asignar un nuevo microservicio" });
        }));
        microServices.forEach((service) => __awaiter(void 0, void 0, void 0, function* () { return yield dataBase_1.appDataSource.getRepository("micro_service").update({ name: service }, { service: req.params["id"] }); }));
        const data = yield dataBase_1.appDataSource.getRepository("service").findOne({ where: { id: req.params["id"] } });
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "ocurrio un error en el servidor!" });
    }
}));
router.put("/services/disable_by_id/:id", (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el campo id"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dataBase_1.appDataSource.getRepository("service").update({ id: Number(req.params["id"]) }, { activo: false });
        return res.send({ message: "el servicio se ha deshabilitado de manera correcta!" });
    }
    catch (error) {
        return res.status(500).send({
            message: "Error interno en el servidor",
            error: error.message // Devuelve el mensaje exacto del error
        });
    }
}));
exports.default = router;

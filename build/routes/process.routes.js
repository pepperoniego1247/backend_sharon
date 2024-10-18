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
router.post("/process/register/", (0, express_validator_1.checkSchema)({
    procedimiento: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "error en el campo procedimiento!"
    },
    fecha: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo fecha no puede estar vacio!"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "el campo activo esta malandro!"
    },
    anamnesis: {
        in: ["body"],
        notEmpty: true,
        errorMessage: "error en el campo anamnesis!"
    },
    process_pigment: {
        in: ["body"],
        isArray: true,
        notEmpty: true,
        errorMessage: "error en el campo pigmento_processsoooo"
    }
}), token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dni = req.body["anamnesis"];
        const anamnesis = yield dataBase_1.appDataSource.getRepository("anamnesis").createQueryBuilder("anamnesis")
            .leftJoinAndSelect("anamnesis.customer", "customer")
            .leftJoinAndSelect("customer.person", "person")
            .where("person.dni = :dni", { dni })
            .getOne();
        if (!anamnesis)
            return res.status(403).send({ message: "el anamnesis no existe!" });
        const { process_pigment } = req.body;
        delete req.body["process_pigment"];
        const newProcess = __rest({
            procedimiento: req.body["procedimiento"],
            fecha: req.body["fecha"],
            activo: req.body["activo"],
            anamnesis: anamnesis,
        }, []);
        const createdProcess = Object.assign({}, newProcess);
        const process = yield dataBase_1.appDataSource.getRepository("process").save(createdProcess);
        /*
        for (let detail of process_pigment) {

            const pigment = await appDataSource.getRepository("pigment").findOne({ where: { nombre: detail.nombre } });
            if (!pigment) return res.status(403).send({ message: "el pigmento no existe!" });

            const { ...newDetail } = {
                nombre: detail.nombre,
                proceso: process,
                pigmento: pigment
            }
            const createDetail: ICreateProcess_pigment = <ICreateProcess_pigment>(<unknown>{ ...newDetail });
            const process_pigment = await appDataSource.getRepository("process_pigment").save(createDetail);

            if (!process_pigment) return res.status(403).send({ message: "Error en el detalle" });
        }
        */
        process_pigment.forEach((pigment) => __awaiter(void 0, void 0, void 0, function* () {
            const aux = pigment + '';
            const item = aux.split(".");
            console.log("owow");
            const newPigment = yield dataBase_1.appDataSource.getRepository("pigment").findOne({ where: { nombre: item[1] } });
            if (!newPigment)
                return res.status(403).send({ message: "el pigmento no existe!" });
            const newDetail = __rest({
                nombre: item[1],
                proceso: process,
                pigmento: newPigment
            }, []);
            const createDetail = Object.assign({}, newDetail);
            const process_pigment = yield dataBase_1.appDataSource.getRepository("process_pigment").save(createDetail);
            if (!process_pigment)
                return res.status(403).send({ message: "Error en el detalle" });
        }));
        return res.send(process);
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}));
router.get("/process/get_all/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield dataBase_1.appDataSource.getRepository("process").find({ relations: ["pigmentoProcesos"] });
        return res.send(allData);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}));
router.get("/process/get_by_dni/:id", (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el parametro"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dni = req.params["id"];
        const anamnesis = yield dataBase_1.appDataSource.getRepository("anamnesis").createQueryBuilder("anamnesis")
            .leftJoinAndSelect("anamnesis.customer", "customer")
            .leftJoinAndSelect("customer.person", "person")
            .where("person.dni = :dni", { dni })
            .getOne();
        if (!anamnesis)
            return res.status(403).send({ message: "el anamnesis no existe!" });
        const Order = yield dataBase_1.appDataSource.getRepository("process").find({ relations: ["pigmentoProcesos"], where: { anamnesis: anamnesis } });
        return res.send(Order);
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}));
router.put("/process/disable_by_id/:id", (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el parametro"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params["id"];
        const Process = yield dataBase_1.appDataSource.getRepository("process").findOne({ relations: ["pigmentoProcesos"], where: { id: id } });
        if (!Process)
            return res.status(403).send({ message: "El proceso no existe!" });
        if (Process.activo == false)
            return res.status(403).send({ message: "el proceso ya está deshabilitadoooo!" });
        const updateActive = yield dataBase_1.appDataSource.getRepository("process").update(Process.id, { activo: false });
        if (!updateActive)
            return res.status(403).send({ message: "error al deshabilitar!" });
        return res.send(Process);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}));
exports.default = router;

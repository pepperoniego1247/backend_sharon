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
const typeorm_1 = require("typeorm");
const router = (0, express_1.Router)();
router.post("/reserve/register/", (0, express_validator_1.checkSchema)({
    reserveDate: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
    },
    initionDate: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
    },
    expirationDate: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
    },
    asignedEmployee: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo empleado asignado invalido!"
    },
    asignedCustomer: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo cliente asignado invalido!"
    },
    reserveDetails: {
        in: ["body"],
        isArray: true,
        notEmpty: true,
        errorMessage: "el campo detalle de reserva es invalido!"
    },
    comision: {
        in: ["body"],
        notEmpty: true,
        errorMessage: "el campo comision es invalido!"
    },
    notation: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo nota es invalido!"
    },
    activo: {
        in: ["body"],
        notEmpty: true,
        custom: {
            options: (value) => value === true
        },
        errorMessage: "el campo activo es invalido!"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asignedEmployee = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { person: { firstName: req.body["asignedEmployee"] } }, relations: ["person"] });
        if (!asignedEmployee)
            return res.status(403).send({ message: "el empleado no existe!" });
        const asignedCustomer = yield dataBase_1.appDataSource.getRepository("customer").findOne({ where: { person: { firstName: req.body["asignedCustomer"] } }, relations: ["person"] });
        if (!asignedCustomer)
            return res.status(403).send({ message: "el cliente no existe!" });
        //TODO VALIDAR QUE FECHA INICIO SEA MENOR QUE FECHA FINAL EN EL CLIENTE
        //TODO AUN FALTA VALIDAR CUANDO F_I Y F_F SOBREPASAN EL RANGO
        const registerIsNotAvailable = yield dataBase_1.appDataSource.getRepository("reserve").findOne({
            where: [
                { initionDate: (0, typeorm_1.Between)(req.body["initionDate"], req.body["expirationDate"]), asignedEmployee: asignedEmployee, activo: true },
                { expirationDate: (0, typeorm_1.Between)(req.body["initionDate"], req.body["expirationDate"]), asignedEmployee: asignedEmployee, activo: true },
                { initionDate: (0, typeorm_1.Between)(req.body["initionDate"], req.body["expirationDate"]), asignedCustomer: asignedCustomer, activo: true },
                { expirationDate: (0, typeorm_1.Between)(req.body["initionDate"], req.body["expirationDate"]), asignedCustomer: asignedCustomer, activo: true },
                { initionDate: (0, typeorm_1.LessThanOrEqual)(req.body["expirationDate"]), expirationDate: (0, typeorm_1.MoreThanOrEqual)(req.body["initionDate"]), asignedEmployee: asignedEmployee, activo: true },
                { initionDate: (0, typeorm_1.LessThanOrEqual)(req.body["expirationDate"]), expirationDate: (0, typeorm_1.MoreThanOrEqual)(req.body["initionDate"]), asignedCustomer: asignedCustomer, activo: true },
            ]
        });
        if (registerIsNotAvailable)
            return res.status(403).send({ message: "el registro no esta permitido!" });
        const newReserve = __rest({
            reserveDate: req.body["reserveDate"],
            initionDate: req.body["initionDate"],
            expirationDate: req.body["expirationDate"],
            activo: req.body["activo"],
            comision: req.body["comision"],
            notation: req.body["notation"],
            asignedCustomer: asignedCustomer,
            asignedEmployee: asignedEmployee
        }, []);
        const newReserveCreated = Object.assign({}, newReserve);
        const reserve = yield dataBase_1.appDataSource.getRepository("reserve").save(newReserveCreated);
        const reserveDetail = __rest({ reserve: reserve }, []);
        req.body["reserveDetails"].forEach((producto) => __awaiter(void 0, void 0, void 0, function* () {
            const item = producto.split(".");
            const newReserveDetail = Object.assign({}, reserveDetail);
            switch (item[0]) {
                case "ms":
                    const microService = yield dataBase_1.appDataSource.getRepository("micro_service").findOne({ where: { name: item[1], activo: true } });
                    newReserveDetail["microServicio"] = microService;
                    yield dataBase_1.appDataSource.getRepository("reserve_detail").save(newReserveDetail);
                    break;
                case "s":
                    const service = yield dataBase_1.appDataSource.getRepository("service").findOne({ where: { description: item[1], activo: true } });
                    newReserveDetail["service"] = service;
                    yield dataBase_1.appDataSource.getRepository("reserve_detail").save(newReserveDetail);
                    break;
                case "p":
                    const promotion = yield dataBase_1.appDataSource.getRepository("promotion").findOne({ where: { name: item[1], activo: true } });
                    newReserveDetail["promotion"] = promotion;
                    yield dataBase_1.appDataSource.getRepository("reserve_detail").save(newReserveDetail);
                    break;
            }
        }));
        const reserveData = yield dataBase_1.appDataSource.getRepository("reserve").findOne({ where: { id: reserve.id }, relations: ["asignedEmployee", "asignedCustomer", "reserveDetails", "reserveDetails.promotion", "reserveDetails.service", "reserveDetails.microServicio"] });
        return res.send(reserveData);
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}));
router.get("/reserve/get_all/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield dataBase_1.appDataSource.getRepository("reserve").find({ relations: ["asignedEmployee", "asignedEmployee.person", "asignedCustomer", "asignedCustomer.person", "reserveDetails", "reserveDetails.promotion", "reserveDetails.service", "reserveDetails.microServicio"] });
        return res.send(allData);
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}));
router.put("/reserve/update_by_id/:id", (0, express_validator_1.checkSchema)({
    initionDate: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
    },
    expirationDate: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
    },
    asignedEmployee: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo empleado asignado invalido!"
    },
    reserveDetails: {
        in: ["body"],
        isArray: true,
        notEmpty: true,
        errorMessage: "el campo detalle de reserva es invalido!"
    },
    comision: {
        in: ["body"],
        notEmpty: true,
        errorMessage: "el campo comision es invalido!"
    },
    notation: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "el campo nota es invalido!"
    },
    activo: {
        in: ["body"],
        notEmpty: true,
        custom: {
            options: (value) => value === true || value === false
        },
        errorMessage: "el campo activo es invalido!"
    }
}), (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el parametro"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reserveToUpdate = yield dataBase_1.appDataSource.getRepository("reserve").findOne({ where: { id: req.params["id"] }, relations: ["asignedEmployee", "asignedCustomer", "reserveDetails"] });
        if (!reserveToUpdate)
            return res.status(403).send({ message: "la reserva solicitada no existe!" });
        const asignedEmployee = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { person: { firstName: req.body["asignedEmployee"] } }, relations: ["person"] });
        console.log(req.body["asignedEmployee"]);
        if (!asignedEmployee)
            return res.status(403).send({ message: "el empleado no existe!" });
        const asignedCustomer = yield dataBase_1.appDataSource.getRepository("customer").findOne({ where: { person: { firstName: req.body["asignedCustomer"] } }, relations: ["person"] });
        if (!asignedCustomer)
            return res.status(403).send({ message: "el cliente no existe!" });
        if (reserveToUpdate["initionDate"] !== req.body["initionDate"] || reserveToUpdate["expirationDate"] !== req.body["expirationDate"]) {
            const registerIsNotAvailable = yield dataBase_1.appDataSource.getRepository("reserve").findOne({
                where: [
                    { initionDate: (0, typeorm_1.Between)(req.body["initionDate"], req.body["expirationDate"]), asignedEmployee: asignedEmployee, activo: true, id: (0, typeorm_1.Not)(req.params["id"]) },
                    { expirationDate: (0, typeorm_1.Between)(req.body["initionDate"], req.body["expirationDate"]), asignedEmployee: asignedEmployee, activo: true, id: (0, typeorm_1.Not)(req.params["id"]) },
                    { initionDate: (0, typeorm_1.Between)(req.body["initionDate"], req.body["expirationDate"]), asignedCustomer: asignedCustomer, activo: true, id: (0, typeorm_1.Not)(req.params["id"]) },
                    { expirationDate: (0, typeorm_1.Between)(req.body["initionDate"], req.body["expirationDate"]), asignedCustomer: asignedCustomer, activo: true, id: (0, typeorm_1.Not)(req.params["id"]) },
                ]
            });
            if (registerIsNotAvailable)
                return res.status(403).send({ message: "las nuevas fechas no se pueden registrar!" });
        }
        yield dataBase_1.appDataSource.getRepository("reserve").update({ id: reserveToUpdate["id"] }, {
            asignedCustomer: asignedCustomer,
            asignedEmployee: asignedEmployee,
            activo: req.body["activo"],
            comision: req.body["comision"],
            notation: req.body["notation"],
            initionDate: req.body["initionDate"],
            expirationDate: req.body["expirationDate"]
        });
        const reserveDetail = __rest({ reserve: reserveToUpdate }, []);
        req.body["reserveDetails"].forEach((producto) => __awaiter(void 0, void 0, void 0, function* () {
            const item = producto.split(".");
            const newReserveDetail = Object.assign({}, reserveDetail);
            switch (item[0]) {
                case "ms":
                    const microService = yield dataBase_1.appDataSource.getRepository("micro_service").findOne({ where: { name: item[1], activo: true } });
                    if (!microService)
                        return res.status(403).send({ message: "error al actualizar la reserva!" });
                    newReserveDetail["microServicio"] = microService;
                    yield dataBase_1.appDataSource.getRepository("reserve_detail").save(newReserveDetail);
                    break;
                case "s":
                    const service = yield dataBase_1.appDataSource.getRepository("service").findOne({ where: { description: item[1], activo: true } });
                    if (!service)
                        return res.status(403).send({ message: "error al actualizar la reserva!" });
                    newReserveDetail["service"] = service;
                    yield dataBase_1.appDataSource.getRepository("reserve_detail").save(newReserveDetail);
                    break;
                case "p":
                    const promotion = yield dataBase_1.appDataSource.getRepository("promotion").findOne({ where: { name: item[1], activo: true } });
                    if (!promotion)
                        return res.status(403).send({ message: "error al actualizar la reserva!" });
                    newReserveDetail["promotion"] = promotion;
                    yield dataBase_1.appDataSource.getRepository("reserve_detail").save(newReserveDetail);
                    break;
            }
        }));
        reserveToUpdate["reserveDetails"].forEach((detail) => __awaiter(void 0, void 0, void 0, function* () { return yield dataBase_1.appDataSource.getRepository("reserve_detail").delete(detail["id"]); }));
        return res.send({ message: "la reserva se ha actualizado correctamente!" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}));
router.delete("/reserve/delete/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("Error en el campo id!"), token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dataBase_1.appDataSource.getRepository("reserve_detail").delete({ reserve: req.params["id"] });
        const result = yield dataBase_1.appDataSource.getRepository("reserve").delete({ id: req.params["id"], activo: true });
        return res.send(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "error interno en el servidor!" });
    }
}));
exports.default = router;

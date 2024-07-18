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
const token_1 = require("../middlewares/token");
const validateRequest_1 = require("../middlewares/validateRequest");
const dataBase_1 = require("../dataBase");
const dotenv = __importStar(require("dotenv"));
const router = (0, express_1.Router)();
dotenv.config();
function consultarDNI(dni) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.API_RENIEC_TOKEN}`,
                },
            });
            if (!response.ok)
                throw new Error("HTTP ERROR EN RENIEC");
            return response.json();
        }
        catch (error) {
            console.error("Error al consultar el DNI:", error);
            throw error;
        }
    });
}
router.post("/customer/register/", (0, express_validator_1.checkSchema)({
    dni: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo dni no puede estar vacio"
    },
    firstName: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo firstname ha tenido un error"
    },
    lastName: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo lastname ha tenido un error"
    },
    phoneNumber: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "datos del numero celular erroneos"
    },
    notation: {
        in: ["body"],
        optional: true,
        isString: true,
        errorMessage: "error en el campo notacion!"
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
        const conditional = {};
        (req.body["dni"] !== "") ? conditional["dni"] = req.body["dni"] : conditional["firstName"] = req.body["firstName"];
        const data = yield dataBase_1.appDataSource.getRepository("person").findOne({ where: Object.assign({}, conditional) });
        if (data)
            return res.status(403).send({ message: "el cliente ya existe" });
        if (req.body["dni"] !== "") {
            const dniResponse = yield consultarDNI(req.body["dni"]);
            const nombresLista = dniResponse['nombres'].split(" ");
            nombresLista.forEach((nombre, index) => nombresLista[index] = nombre[0] + nombre.slice(1, nombre.length).toLowerCase());
            req.body["firstName"] = nombresLista.join(" ");
            req.body["lastName"] = `${dniResponse["apellidoPaterno"][0]}${dniResponse["apellidoPaterno"].slice(1, dniResponse["apellidoPaterno"].length).toLowerCase()} ${dniResponse["apellidoMaterno"][0]}${dniResponse["apellidoMaterno"].slice(1, dniResponse["apellidoMaterno"].length).toLowerCase()}`;
        }
        const newPerson = __rest(req.body, []);
        const newCreatedPerson = Object.assign({}, newPerson);
        const personCreated = yield dataBase_1.appDataSource.getRepository("person").save(newCreatedPerson);
        //! CONSIDERAR HACER EMAIL OPCIONAL
        const newCustomer = __rest({
            person: personCreated,
            notation: req.body["notation"]
        }, []);
        const newCreatedCustomer = Object.assign({}, newCustomer);
        const newCustomerCreated = yield dataBase_1.appDataSource.getRepository("customer").save(newCreatedCustomer);
        return res.send(newCustomerCreated);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.get("/customer/get_all/", token_1.validationToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("customer").find({ relations: ["person"] });
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.get("/customer/get_by_dni/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro dni es erroneo"), validateRequest_1.validateReq, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dni = req.params["id"];
    try {
        const data = yield dataBase_1.appDataSource.getRepository("customer").createQueryBuilder("customer")
            .leftJoinAndSelect("customer.person", "person").where("person.dni = :dni", { dni })
            .getOne();
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.put("/customer/update_by_id/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("verifique el id pasado como parametro"), (0, express_validator_1.checkSchema)({
    dni: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo dni no puede estar vacio"
    },
    firstName: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo firstname ha tenido un error"
    },
    lastName: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo lastname ha tenido un error"
    },
    phoneNumber: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "datos del numero celular erroneos"
    },
    notation: {
        in: ["body"],
        optional: true,
        isString: true,
        errorMessage: "error en el campo notacion!"
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
        //! SOLO SE PUEDE MODIFICAR TELEFONO, ESTADO Y EMAIL
        const customerExists = yield dataBase_1.appDataSource.getRepository("customer").findOne({ where: { id: req.params["id"] }, relations: ["person"] });
        if (!customerExists)
            return res.status(403).send({ message: "el cliente no existe!" });
        const personExists = yield dataBase_1.appDataSource.getRepository("person").findOne({ where: { id: customerExists["person"]["id"] } });
        if (!personExists)
            return res.status(403).send({ message: "los datos del cliente son inexistentes" });
        if (req.body["dni"]) {
            const dniResponse = yield consultarDNI(req.body["dni"]);
            const nombresLista = dniResponse['nombres'].split(" ");
            nombresLista.forEach((nombre, index) => nombresLista[index] = nombre[0] + nombre.slice(1, nombre.length).toLowerCase());
            req.body["firstName"] = nombresLista.join(" ");
            req.body["lastName"] = `${dniResponse["apellidoPaterno"][0]}${dniResponse["apellidoPaterno"].slice(1, dniResponse["apellidoPaterno"].length).toLowerCase()} ${dniResponse["apellidoMaterno"][0]}${dniResponse["apellidoMaterno"].slice(1, dniResponse["apellidoMaterno"].length).toLowerCase()}`;
        }
        const { notation } = req.body;
        delete req.body["notation"];
        const newDataPerson = __rest(req.body, []);
        const newDataUpdated = Object.assign({}, newDataPerson);
        yield dataBase_1.appDataSource.getRepository("customer").update({ id: req.params["id"] }, { notation: notation });
        const response = yield dataBase_1.appDataSource.getRepository("person").update({ id: customerExists["person"]["id"] }, Object.assign({}, newDataUpdated));
        return res.send(response);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
exports.default = router;

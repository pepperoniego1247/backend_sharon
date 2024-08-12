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
const generateAnamnesis_1 = require("../scripts/generateAnamnesis");
const router = (0, express_1.Router)();
dotenv.config();
router.get("/anamnesis/get_all/", token_1.validationToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("anamnesis").find({
            relations: ["customer.person"]
        });
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor" });
    }
}));
router.get("/anamnesis/get_by_dni/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro dni es erroneo"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dni = req.params["id"];
    const data = yield dataBase_1.appDataSource.getRepository("anamnesis").createQueryBuilder("anamnesis")
        .leftJoinAndSelect("anamnesis.customer", "customer")
        .leftJoinAndSelect("customer.person", "person")
        .where("person.dni = :dni", { dni })
        .getOne();
    if (!data)
        return res.status(403).send({ message: "el anamnesis no existe!" });
    return res.send(data);
}));
router.post("/anamnesis/register/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro dni es erroneo"), validateRequest_1.validateReq, token_1.validationToken, (0, express_validator_1.checkSchema)({
    birthDate: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo nacimiento no puede estar vacio"
    },
    address: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo direccion ha tenido un error"
    },
    city: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo ciudad ha tenido un error"
    },
    email: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "datos del email erroneos"
    },
    other: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "datos erroneos"
    },
    provenencia: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo provenencia no puede estar vacio"
    },
    queloide: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo queloide ha tenido un error"
    },
    lentesDeContacto: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo lentesDeContacto ha tenido un error"
    },
    aspirinas: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo aspirinas ha tenido un error"
    },
    depresion: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo depresion ha tenido un error"
    },
    enfermedadesCardiovasculares: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo enfermedadesCardiovasculares ha tenido un error"
    },
    epilepsia: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo epilepsia ha tenido un error"
    },
    hipertension: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo hipertension ha tenido un error"
    },
    problemasIntestinales: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo problemasIntestinales ha tenido un error"
    },
    problemasRenales: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo problemasRenales ha tenido un error"
    },
    problemasRespiratorios: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo problemasRespiratorios ha tenido un error"
    },
    problemasCirculatorios: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo problemasCirculatorios ha tenido un error"
    },
    alergias: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo alergias ha tenido un error"
    },
    tatuajes: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo tatuajes ha tenido un error"
    },
    hemofilia: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo hemofilia ha tenido un error"
    },
    cancer: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo cancer ha tenido un error"
    },
    vihPlus: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo vihPlus ha tenido un error"
    },
    marcaPasos: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo marcaPasos ha tenido un error"
    },
    diabetes: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo diabetes ha tenido un error"
    },
    glaucoma: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo glaucoma ha tenido un error"
    },
    embarazada: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo embarazada ha tenido un error"
    },
    hepatitis: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo hepatitis ha tenido un error"
    },
    anemia: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo anemia ha tenido un error"
    },
    radioUno: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioUno ha tenido un error"
    },
    respuestaUno: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaUno ha tenido un error"
    },
    radioDos: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioDos ha tenido un error"
    },
    respuestaDos: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaDos ha tenido un error"
    },
    radioTres: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioTres ha tenido un error"
    },
    respuestaTres: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaTres ha tenido un error"
    },
    radioCuatro: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioCuatro ha tenido un error"
    },
    respuestaCuatro: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaCuatro ha tenido un error"
    },
    radioCinco: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioCinco ha tenido un error"
    },
    respuestaCinco: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaCinco ha tenido un error"
    },
    respuestaSeis: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaSeis ha tenido un error"
    },
    observacion: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo observacion ha tenido un error"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dni = req.params["id"];
        const busqueda = yield dataBase_1.appDataSource.getRepository("anamnesis").createQueryBuilder("anamnesis")
            .leftJoinAndSelect("anamnesis.customer", "customer")
            .leftJoinAndSelect("customer.person", "person")
            .where("person.dni = :dni", { dni })
            .getOne();
        if (busqueda)
            return res.status(403).send({ message: "el anamnesis ya existe!" });
        // Obtener la persona asignada
        const asignedPerson = yield dataBase_1.appDataSource.getRepository("person").findOne({ where: { dni } });
        if (!asignedPerson) {
            return res.status(404).send({ message: "Persona no encontrada" });
        }
        // Obtener el cliente asignado
        const asignedCustomer = yield dataBase_1.appDataSource.getRepository("customer").findOne({ where: { person: asignedPerson } });
        if (!asignedCustomer) {
            return res.status(404).send({ message: "Cliente no encontrado" });
        }
        // Combinar los datos de req.body con el cliente asignado
        const anamnesis = Object.assign(Object.assign({}, req.body), { customer: asignedCustomer });
        console.log(anamnesis);
        const newAnamnesis = Object.assign({}, anamnesis);
        // Guardar el nuevo anamnesis en la base de datos
        const data = yield dataBase_1.appDataSource.getRepository("anamnesis").save(newAnamnesis);
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({ message: "ha ocurrido un error interno" });
    }
}));
router.put("/anamnesis/update_by_dni/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro dni es erroneo"), validateRequest_1.validateReq, token_1.validationToken, (0, express_validator_1.checkSchema)({
    birthDate: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo nacimiento no puede estar vacio"
    },
    address: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo direccion ha tenido un error"
    },
    city: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo ciudad ha tenido un error"
    },
    email: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "datos del email erroneos"
    },
    other: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "datos erroneos"
    },
    provenencia: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo provenencia no puede estar vacio"
    },
    queloide: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo queloide ha tenido un error"
    },
    lentesDeContacto: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo lentesDeContacto ha tenido un error"
    },
    aspirinas: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo aspirinas ha tenido un error"
    },
    depresion: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo depresion ha tenido un error"
    },
    enfermedadesCardiovasculares: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo enfermedadesCardiovasculares ha tenido un error"
    },
    epilepsia: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo epilepsia ha tenido un error"
    },
    hipertension: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo hipertension ha tenido un error"
    },
    problemasIntestinales: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo problemasIntestinales ha tenido un error"
    },
    problemasRenales: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo problemasRenales ha tenido un error"
    },
    problemasRespiratorios: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo problemasRespiratorios ha tenido un error"
    },
    problemasCirculatorios: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo problemasCirculatorios ha tenido un error"
    },
    alergias: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo alergias ha tenido un error"
    },
    tatuajes: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo tatuajes ha tenido un error"
    },
    hemofilia: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo hemofilia ha tenido un error"
    },
    cancer: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo cancer ha tenido un error"
    },
    vihPlus: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo vihPlus ha tenido un error"
    },
    marcaPasos: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo marcaPasos ha tenido un error"
    },
    diabetes: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo diabetes ha tenido un error"
    },
    glaucoma: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo glaucoma ha tenido un error"
    },
    embarazada: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo embarazada ha tenido un error"
    },
    hepatitis: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo hepatitis ha tenido un error"
    },
    anemia: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo anemia ha tenido un error"
    },
    radioUno: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioUno ha tenido un error"
    },
    respuestaUno: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaUno ha tenido un error"
    },
    radioDos: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioDos ha tenido un error"
    },
    respuestaDos: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaDos ha tenido un error"
    },
    radioTres: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioTres ha tenido un error"
    },
    respuestaTres: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaTres ha tenido un error"
    },
    radioCuatro: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioCuatro ha tenido un error"
    },
    respuestaCuatro: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaCuatro ha tenido un error"
    },
    radioCinco: {
        in: ["body"],
        isBoolean: true,
        optional: true,
        errorMessage: "el campo radioCinco ha tenido un error"
    },
    respuestaCinco: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaCinco ha tenido un error"
    },
    respuestaSeis: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo respuestaSeis ha tenido un error"
    },
    observacion: {
        in: ["body"],
        isString: true,
        optional: true,
        errorMessage: "el campo observacion ha tenido un error"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dni = req.params["id"];
    console.log(req.body);
    const busqueda = yield dataBase_1.appDataSource.getRepository("anamnesis").createQueryBuilder("anamnesis")
        .leftJoinAndSelect("anamnesis.customer", "customer")
        .leftJoinAndSelect("customer.person", "person")
        .where("person.dni = :dni", { dni })
        .getOne();
    if (!busqueda)
        return res.status(403).send({ message: "el anamnesis no existe prro!" });
    // Desestructuración del id y el objeto customer de anamnesis, osea se petatean
    const _a = req.body, { id, customer } = _a, anamnesis = __rest(_a, ["id", "customer"]);
    const updateAnamnesis = Object.assign({}, anamnesis);
    const updateData = yield dataBase_1.appDataSource.getRepository("anamnesis").update(busqueda.id, updateAnamnesis);
    return res.send({
        message: "se ha actualizado con exito el Anamnesis!",
        data: updateData
    });
}));
router.get("/anamnesis/get_pdf_by_id/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("parametro id esperado!"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdf = yield (0, generateAnamnesis_1.generatePdfAnamnesis)();
        res.contentType('application/pdf');
        res.send(pdf);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'El documento no se ha generado correctamente!' });
    }
}));
exports.default = router;

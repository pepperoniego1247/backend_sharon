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
const token_1 = require("../middlewares/token");
const express_1 = require("express");
const dotenv = __importStar(require("dotenv"));
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middlewares/validateRequest");
const dataBase_1 = require("../dataBase");
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const activeSession_1 = require("../entities/activeSession");
const router = (0, express_1.Router)();
dotenv.config();
router.post("/user/login/", (0, express_validator_1.checkSchema)({
    userName: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "username invalido, evita los espacios vacios o caracteres incorrectos."
    },
    password: {
        in: ["body"],
        isLength: {
            options: { max: 30, min: 8 },
            errorMessage: "max: 30 | min: 8 caracteres validos, contraseña incorrecta!"
        },
        isString: { errorMessage: "la constraseña solo debe contener letras y numeros" }
    },
    device: {
        in: ["body"],
        isString: true,
        notEmpty: { errorMessage: "el dispositivo no puede tener campos vacios!" }
    }
}), validateRequest_1.validateReq, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToAuth = yield dataBase_1.appDataSource.getRepository("user").findOne({ where: { userName: req.body["userName"] }, relations: ["employee", "employee.role"] });
        if (!userToAuth)
            return res.status(403).json({ message: "el username no existe!" });
        if (!(yield bcrypt.compare(req.body["password"], userToAuth["password"])))
            return res.status(401).json({ message: "contraseña erronea!" });
        const accessToken = yield jwt.sign({
            userName: userToAuth["userName"],
            id: userToAuth["id"]
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1hr",
            // algorithm: "HS256"
        });
        const verifySession = yield dataBase_1.appDataSource.getRepository(activeSession_1.ActiveSession).findOne({ where: { user: userToAuth } });
        if (verifySession)
            return res.status(403).json({ message: "el usuario ya esta logueado!" });
        const decodedToken = jwt.decode(accessToken, { json: true });
        const creationDate = new Date(decodedToken.iat * 1000);
        const expirationDate = new Date(decodedToken.exp * 1000);
        const activeSession = {
            user: userToAuth,
            device: req.body["device"],
            creationDate: creationDate,
            expirationDate: expirationDate,
            jwt: accessToken
        };
        yield dataBase_1.appDataSource.getRepository(activeSession_1.ActiveSession).save(activeSession);
        return res.send({
            message: "logeo existoso!",
            jwt: accessToken,
            type: userToAuth.type,
            id: userToAuth.id,
            expirationDate: expirationDate
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error en el servidor!" });
    }
}));
router.post("/user/register/", (0, express_validator_1.checkSchema)({
    userName: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "username invalido!!",
    },
    password: {
        in: ["body"],
        isLength: {
            options: { max: 30, min: 5 },
            errorMessage: "max: 30 | min: 5 caracteres! contraseña invalida"
        },
        isAlphanumeric: { errorMessage: "la contraseña debe contener solo letras y numeros!" }
    },
    dni: {
        in: ["body"],
        isNumeric: { errorMessage: "el dni debe ser numerico" },
        notEmpty: true,
        errorMessage: "el campo dni no puede estar vacio"
    },
    type: {
        in: ["body"],
        custom: {
            options: (value) => value === "Administrador" || value === "Moderador" || value === "Usuario"
        },
        isString: true,
        notEmpty: true,
        errorMessage: "Tipo de usuario invalido."
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAlreadyExists = yield dataBase_1.appDataSource.getRepository("user").findOne({ where: { userName: req.body["userName"] } });
        if (userAlreadyExists)
            return res.status(403).json({ message: "el usuario ya existe!" });
        const findPerson = yield dataBase_1.appDataSource.getRepository("person").findOne({ where: { dni: req.body["dni"] } });
        if (!findPerson)
            return res.status(403).send({ message: "la persona no existe en el sistema!" });
        const findEmployee = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { person: findPerson } });
        if (!findEmployee)
            return res.status(403).send({ message: "el empleado no existe!" });
        const user = __rest(req.body, []);
        const newUser = Object.assign({}, user);
        newUser["employee"] = findEmployee;
        newUser["password"] = yield bcrypt.hash(newUser["password"], 8);
        const data = yield dataBase_1.appDataSource.getRepository("user").save(newUser);
        const { userName, employee } = data;
        return res.send({
            userName: userName,
            employee: employee
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
}));
router.get("/user/get_all/", token_1.validationToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield dataBase_1.appDataSource.getRepository("user").find({ relations: ["employee", "employee.person", "employee.role"], select: ["id", "userName", "password", "type"] });
        if (!allUsers)
            return res.status(403).send({ message: "error al encontrar los usuarios!" });
        allUsers.forEach((user) => {
            // console.log(user["type"]);
            const { password } = user;
            user["password"] = password.slice(0, 20);
        });
        return res.send(allUsers);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
}));
router.get("/user/get_by_userName/:userName", (0, express_validator_1.param)("userName")
    .isString()
    .withMessage("el id debe ser entero!"), validateRequest_1.validateReq, 
// validationToken,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userById = yield dataBase_1.appDataSource.getRepository("user").findOne({ where: { userName: req.params["userName"] } });
        if (!userById)
            return res.status(403).send({ message: "el usuario no existe!", status: false });
        return res.send({
            message: "usuario encontrado!",
            userId: userById.id
        });
    }
    catch (error) {
        return res.status(500).send({
            message: "error en el servidor!",
            error: error
        });
    }
}));
router.get("/user/get_by_id/:id", (0, express_validator_1.param)("id")
    .isNumeric()
    .withMessage("el id debe ser entero!"), validateRequest_1.validateReq, 
// validationToken,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userById = yield dataBase_1.appDataSource.getRepository("user").findOne({ where: { id: req.params["id"] }, relations: ["employee", "employee.person", "employee.role"] });
        if (!userById)
            return res.status(403).send({ message: "el usuario no existe!", status: false });
        return res.send({
            message: "usuario encontrado!",
            userId: userById
        });
    }
    catch (error) {
        return res.status(500).send({
            message: "error en el servidor!",
            error: error
        });
    }
}));
router.put("/user/edit_profile_by_id/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("error en el campo id"), (0, express_validator_1.checkSchema)({
    phoneNumber: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo phonenumber"
    },
    avatar: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "error en el campo avatar"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield dataBase_1.appDataSource.getRepository("user").findOne({ where: { id: req["params"]["id"] } });
        if (!user)
            return res.status(403).send({ message: "el usuario no existe!" });
        const updateUser = __rest(req.body, []);
        const updatedUser = Object.assign({}, updateUser);
        console.log(updatedUser);
        yield dataBase_1.appDataSource.getRepository("user").update({ id: req.params["id"] }, { avatar: updatedUser["avatar"] });
        // await appDataSource.getRepository("user").update({ id: req.params["id"] }, { employee: { person: { phoneNumber: updatedUser["phoneNumber"] } } });
        return res.send({ message: "se ha actualizado correctamente!" });
    }
    catch (error) {
        console.log(error);
    }
}));
router.put("/user/edit_by_id/:id", (0, express_validator_1.checkSchema)({
    userName: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "userName invalido!!",
    },
    password: {
        in: ["body"],
        optional: true,
        isLength: {
            options: { max: 30, min: 5 },
            errorMessage: "max: 30 | min: 5 caracteres validos, contraseña incorrecta!"
        },
        isAlphanumeric: { errorMessage: "la contraseña solo debe contener letras y numeros" }
    },
    type: {
        in: ["body"],
        custom: {
            options: (value) => value === "Administrador" || value === "Moderador" || value === "Usuario"
        },
        isString: true,
        notEmpty: true,
        errorMessage: "Tipo de usuario invalido."
    }
}), (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el id debe ser numerico!"), 
// validationToken,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToEdit = yield dataBase_1.appDataSource.getRepository("user").findOne({ where: { id: req.params["id"] } });
        if (!userToEdit)
            return res.status(403).send({ message: "el usuario no existe!" });
        const userData = __rest(req.body, []);
        const userToUpdate = Object.assign({}, userData);
        userToUpdate["password"] = yield bcrypt.hash(req.body["password"], 8);
        const { userName, password, type } = userToUpdate;
        (userToEdit["password"].slice(0, 20) !== req.body["password"]) ? yield dataBase_1.appDataSource.getRepository("user").update({ id: userToEdit["id"] }, { userName: userName, password: password, type: type }) : yield dataBase_1.appDataSource.getRepository("user").update({ id: userToEdit["id"] }, { userName: userName, type: type });
        return res.send({
            message: "el usuario se ha actualizado!"
        });
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
router.delete("/user/log_out/:id", (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el campo id"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dataBase_1.appDataSource.getRepository(activeSession_1.ActiveSession).delete({ user: { id: Number(req.params["id"]) } });
        return res.send({ message: "el usuario ha cerrado sesion correctamente!" });
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor!" });
    }
}));
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post("session/register/", (0, express_validator_1.checkSchema)({
    userId: {
        in: ["body"],
        isNumeric: { errorMessage: "la id de usuario solo puede ser numerico!" },
        notEmpty: { errorMessage: "el valor no puede estar vacio!" }
    },
    jwt: {
        in: ["body"],
        isAlpha: true,
        notEmpty: true,
        errorMessage: "valores vacios o no son cadena de texto!"
    },
    device: {
        in: ["body"],
        isAlpha: true,
        notEmpty: true,
        errorMessage: "se necesita de un dispostivo"
    },
    creationDate: {
        in: ["body"],
        isDate: true,
        notEmpty: true,
        errorMessage: "fecha de creacion faltante!"
    }
}));

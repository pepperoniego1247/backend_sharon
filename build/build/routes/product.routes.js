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
router.post("/product/register/", (0, express_validator_1.checkSchema)({
    name: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "error en el campo nombre"
    },
    category: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "error en el campo categoria"
    },
    price: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo precio"
    },
    description: {
        in: ["body"],
        isString: true,
        notEmpty: true,
        errorMessage: "error en el campo descripcion"
    },
    cantidad: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo cantidad"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "error en el campo activo"
    },
    comerciable: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "error en el campo comerciable"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productAlreadyExists = yield dataBase_1.appDataSource.getRepository("product").findOne({ where: { name: req.body["name"] } });
        if (productAlreadyExists)
            return res.status(403).send({ message: "el producto ya existe!" });
        const newProduct = __rest({
            name: req.body["name"],
            category: req.body["category"],
            price: req.body["price"],
            cantidad: req.body["cantidad"],
            activo: req.body["activo"],
            comerciable: req.body["comerciable"]
        }, []);
        const newProductCreated = Object.assign({}, newProduct);
        const product = yield dataBase_1.appDataSource.getRepository("product").save(newProductCreated);
        return res.send(product);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
router.get("/product/get_all/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield dataBase_1.appDataSource.getRepository("product").find();
        return res.send(allData);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
router.put("/product/update_by_id/:id", (0, express_validator_1.checkSchema)({
    name: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "error en el campo nombre"
    },
    category: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "error en el campo categoria"
    },
    price: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo precio"
    },
    cantidad: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo cantidad"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "error en el campo activo"
    },
    comerciable: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "error en el campo comerciable"
    }
}), (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .withMessage("error en el parametro id"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productExists = yield dataBase_1.appDataSource.getRepository("product").find({ where: { id: req.params["id"] } });
        if (!productExists)
            return res.status(403).send({ message: "no existe el producto!" });
        const newUpdateProduct = __rest(req.body, []);
        const newProductUpdated = Object.assign({}, newUpdateProduct);
        const update = yield dataBase_1.appDataSource.getRepository("product").update({ id: req.params["id"] }, Object.assign({}, newProductUpdated));
        return res.send(update);
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
exports.default = router;

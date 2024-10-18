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
router.post("/promotion/register/", (0, express_validator_1.checkSchema)({
    name: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "error en el campo name"
    },
    precio: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo precio"
    },
    promotionDetails: {
        in: ["body"],
        notEmpty: true,
        isArray: true,
        errorMessage: "error en el campo promotionDetail"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "error en el campo activo"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotionAlreadyExists = yield dataBase_1.appDataSource.getRepository("promotion").findOne({ where: { name: req.body["name"] } });
        if (promotionAlreadyExists)
            return res.status(403).send({ message: "la promocion ya existe!" });
        const newPromotion = __rest({
            name: req.body["name"],
            precio: req.body["precio"],
            activo: req.body["activo"]
        }, []);
        const newPromotionCreated = Object.assign({}, newPromotion);
        const promotion = yield dataBase_1.appDataSource.getRepository("promotion").save(newPromotionCreated);
        const newPromotionDetail = __rest({ promotion: promotion }, []);
        const { promotionDetails } = req.body;
        promotionDetails.forEach((name) => __awaiter(void 0, void 0, void 0, function* () {
            const newPromotionDetailCreated = Object.assign({}, newPromotionDetail);
            newPromotionDetailCreated["service"] = yield dataBase_1.appDataSource.getRepository("service").findOne({ where: { description: name, activo: true } });
            yield dataBase_1.appDataSource.getRepository("promotion_detail").save(newPromotionDetailCreated);
        }));
        const promotionN = yield dataBase_1.appDataSource.getRepository("promotion").findOne({ where: { id: promotion["id"] }, relations: ["promotionDetails"] });
        return res.send(promotionN);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "error en el servidor" });
    }
}));
router.get("/promotion/get_all/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield dataBase_1.appDataSource.getRepository("promotion").find({ relations: ["promotionDetails", "promotionDetails.service"] });
        return res.send(allData);
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
}));
router.put("/promotion/update_by_id/:id", (0, express_validator_1.checkSchema)({
    name: {
        in: ["body"],
        notEmpty: true,
        isString: true,
        errorMessage: "error en el campo name"
    },
    precio: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "error en el campo precio"
    },
    promotionDetails: {
        in: ["body"],
        notEmpty: true,
        isArray: true,
        errorMessage: "error en el campo promotionDetail"
    },
    activo: {
        in: ["body"],
        isBoolean: true,
        notEmpty: true,
        errorMessage: "error en el campo activo"
    }
}), validateRequest_1.validateReq, token_1.validationToken, (0, express_validator_1.param)("id")
    .notEmpty()
    .isNumeric({ no_symbols: true }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotionExists = yield dataBase_1.appDataSource.getRepository("promotion").findOne({ where: { id: req.params["id"] }, relations: ["promotionDetails"] });
        if (!promotionExists)
            return res.status(403).send({ message: "la promocion no existe!!" });
        const updatePromotion = __rest({
            name: req.body["name"],
            precio: req.body["precio"],
            activo: req.body["activo"]
        }, []);
        const updateNewPromotion = Object.assign({}, updatePromotion);
        yield dataBase_1.appDataSource.getRepository("promotion").update({ id: req.params["id"] }, Object.assign({}, updateNewPromotion));
        const newPromotionDetailCreated = __rest({ promotion: promotionExists }, []);
        req.body["promotionDetails"].forEach((name) => __awaiter(void 0, void 0, void 0, function* () {
            const newPromotionDetail = Object.assign({}, newPromotionDetailCreated);
            newPromotionDetail["service"] = yield dataBase_1.appDataSource.getRepository("service").findOne({ where: { description: name, activo: true } });
            yield dataBase_1.appDataSource.getRepository("promotion_detail").save(newPromotionDetail);
        }));
        promotionExists["promotionDetails"].forEach((detail) => __awaiter(void 0, void 0, void 0, function* () { return yield dataBase_1.appDataSource.getRepository("promotion_detail").delete(detail["id"]); }));
        return res.send({ message: "se actualizo correctamente!!!" });
    }
    catch (error) {
        return res.status(500).send({ message: "error en el servidor!" });
    }
}));
exports.default = router;

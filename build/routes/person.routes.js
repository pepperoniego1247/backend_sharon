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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataBase_1 = require("../dataBase");
const token_1 = require("../middlewares/token");
const router = (0, express_1.Router)();
router.get("/person/get_all_dni/", token_1.validationToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allDni = yield dataBase_1.appDataSource.getRepository("person").find({ select: ["dni"] });
        const allEmployess = yield dataBase_1.appDataSource.getRepository("employee").find({ relations: ["person"] });
        const allCustomer = yield dataBase_1.appDataSource.getRepository("customer").find({ relations: ["person"] });
        allDni.forEach((object, index) => {
            const { dni } = object;
            allEmployess.forEach((employee) => (employee.person["dni"] === dni) ? allDni.splice(index, 1) : null);
            allCustomer.forEach((customer) => (customer.person["dni"] === dni) ? allDni.splice(index, 1) : null);
        });
        return res.send(allDni);
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor" });
    }
}));
exports.default = router;

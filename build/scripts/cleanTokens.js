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
exports.cleanTokens = void 0;
const typeorm_1 = require("typeorm");
const dataBase_1 = require("../dataBase");
const activeSession_1 = require("../entities/activeSession");
const cleanTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dataBase_1.appDataSource.getRepository(activeSession_1.ActiveSession).delete({ expirationDate: (0, typeorm_1.LessThan)(new Date()) });
    }
    catch (error) { }
});
exports.cleanTokens = cleanTokens;

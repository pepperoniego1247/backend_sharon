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
exports.statusNewDocument = exports.requestNewDocumentSunat = void 0;
const requestNewDocumentSunat = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const newDocumentBoleta = yield fetch("https://back.apisunat.com/personas/v1/sendBill", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (!newDocumentBoleta.ok)
        throw new Error("ERROR EN SUNAT");
    return newDocumentBoleta.json();
});
exports.requestNewDocumentSunat = requestNewDocumentSunat;
const statusNewDocument = (documentId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://back.apisunat.com/documents/${documentId}/getById`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (!response.ok)
        throw new Error("ERROR EN ESTADO DE DOCUMENTO");
    return response.json();
});
exports.statusNewDocument = statusNewDocument;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdfAnamnesis = void 0;
const pdf_lib_1 = require("pdf-lib");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generatePdfAnamnesis = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (data = null) {
    data = {
        firstName: "Fabio Joaquin",
        lastName: "Arribasplata Chavarri",
        dni: "76450010",
        birthDate: "22/12/2002",
        phoneNumber: "959737432",
        address: "Isaac Albeniz Urb. Primavera",
        city: "Trujillo",
        email: "pepperoniego@hotmail.com",
        other: "Gusto de los videojuegos",
        queloide: true,
        lentesDeContacto: false,
        aspirinas: false,
        depresion: true,
        enfermedadesCardiovasculares: false,
        epilepsia: true,
        hipertension: false,
        problemasIntestinales: false,
        problemasRenales: false,
        problemasRespiratorios: true,
        problemasCirculatorios: false,
        alergias: true,
        tatuajes: false,
        hemofilia: false,
        cancer: false,
        vihPlus: false,
        marcaPasos: true,
        diabetes: false,
        glaucoma: false,
        embarazada: false,
        hepatitis: true,
        anemia: true
    };
    const pdfLoaded = fs_1.default.readFileSync(path_1.default.join(__dirname, '../extras/ANAMNESIS.pdf'));
    const pdf = yield pdf_lib_1.PDFDocument.load(pdfLoaded);
    //* PARA SI X = 246 PARA NO = 282 Y PARA BAJAR ES SOLO -22
    const coordinatesData = [
        { text: `${data["firstName"]} ${data["lastName"]}`, x: 125, y: 659 },
        { text: data["dni"], x: 360, y: 659 },
        { text: data["birthDate"], x: 210, y: 638 },
        { text: data["phoneNumber"], x: 357, y: 638 },
        { text: data["address"], x: 132, y: 617 },
        { text: data["city"], x: 366, y: 618 },
        { text: data["email"], x: 118.5, y: 598 },
        { text: data["other"], x: 310, y: 598 },
        { isChecked: data["queloide"], x: (data["queloide"]) ? 246 : 282, y: 492 },
        { isChecked: data["lentesDeContacto"], x: (data["lentesDeContacto"]) ? 246 : 282, y: 400 },
        { isChecked: data["aspirinas"], x: (data["aspirinas"]) ? 246 : 282, y: 400 },
        { isChecked: data["depresion"], x: (data["depresion"]) ? 246 : 282, y: 400 },
        { isChecked: data["enfermedadesCardiovasculares"], x: (data["enfermedadesCardiovasculares"]) ? 246 : 282, y: 400 },
        { isChecked: data["epilepsia"], x: (data["epilepsia"]) ? 246 : 282, y: 400 },
        { isChecked: data["hipertension"], x: (data["hipertension"]) ? 246 : 282, y: 400 },
        { isChecked: data["problemasIntestinales"], x: (data["problemasIntestinales"]) ? 246 : 282, y: 400 },
        { isChecked: data["problemasRenales"], x: (data["problemasRenales"]) ? 246 : 282, y: 400 },
        { isChecked: data["problemasRespiratorios"], x: (data["problemasRespiratorios"]) ? 246 : 282, y: 400 },
        { isChecked: data["problemasCirculatorios"], x: (data["problemasCirculatorios"]) ? 246 : 282, y: 400 },
        { isChecked: data["alergias"], x: (data["alergias"]) ? 246 : 282, y: 400 },
        { isChecked: data["tatuajes"], x: (data["tatuajes"]) ? 246 : 282, y: 400 },
        { isChecked: data["hemofilia"], x: (data["hemofilia"]) ? 246 : 282, y: 400 },
        { isChecked: data["queloide"], x: (data["queloide"]) ? 246 : 282, y: 400 },
        { isChecked: data["queloide"], x: (data["queloide"]) ? 246 : 282, y: 400 },
        { isChecked: data["queloide"], x: (data["queloide"]) ? 246 : 282, y: 400 },
        { isChecked: data["queloide"], x: (data["queloide"]) ? 246 : 282, y: 400 },
        { isChecked: data["queloide"], x: (data["queloide"]) ? 246 : 282, y: 400 },
        { isChecked: data["queloide"], x: (data["queloide"]) ? 246 : 282, y: 400 },
    ];
    const page = pdf.getPages()[0];
    coordinatesData.forEach((data, index) => {
        if ('text' in data)
            page.drawText(data["text"], { x: data.x, y: data.y, size: 10 });
        if ('isChecked' in data)
            page.drawCircle({ x: data["x"], y: data["y"], size: 4 });
    });
    // page.drawText("Fabio Joaquin Arribasplata Chavarri", { x: 125, y: 659, size: 10 });
    // page.drawText("76450010", { x: 360, y: 659, size: 10 });
    // page.drawText("22/12/2002", { x: 210, y: 638, size: 10 });
    // page.drawText("959737432", { x: 357, y: 638, size: 10 });
    // page.drawText("Isaac Albeniz Urb. Primavera", { x: 132, y: 617, size: 10 });
    // page.drawText("Trujillo", { x: 366, y: 618, size: 10 });
    // page.drawText("pepperoniego@hotmail.com", { x: 118.5, y: 598, size: 10 });
    // page.drawText("Gusto de los videojuegos", { x: 309, y: 598, size: 10 });
    const pdfCreated = Buffer.from(yield pdf.save());
    return pdfCreated;
});
exports.generatePdfAnamnesis = generatePdfAnamnesis;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numeroALetras = void 0;
function numeroALetras(numero) {
    const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const decenas = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const especiales = {
        11: "ONCE", 12: "DOCE", 13: "TRECE", 14: "CATORCE", 15: "QUINCE",
        16: "DIECISEIS", 17: "DIECISIETE", 18: "DIECIOCHO", 19: "DIECINUEVE"
    };
    function convertirCentenas(n) {
        if (n === 100) {
            return "CIEN";
        }
        else if (n < 100) {
            return convertirDecenas(n);
        }
        else {
            const centenas = Math.floor(n / 100);
            const resto = n % 100;
            if (centenas === 1) {
                return "CIENTO " + convertirDecenas(resto);
            }
            else if (centenas === 5) {
                return "QUINIENTOS " + convertirDecenas(resto);
            }
            else if (centenas === 7) {
                return "SETECIENTOS " + convertirDecenas(resto);
            }
            else if (centenas === 9) {
                return "NOVECIENTOS " + convertirDecenas(resto);
            }
            else {
                return unidades[centenas] + "CIENTOS " + convertirDecenas(resto);
            }
        }
    }
    function convertirDecenas(n) {
        if (n < 10) {
            return unidades[n];
        }
        else if (10 < n && n < 20) {
            return especiales[n];
        }
        else {
            const decena = Math.floor(n / 10);
            const unidad = n % 10;
            if (unidad === 0) {
                return decenas[decena];
            }
            else {
                return decenas[decena] + " Y " + unidades[unidad];
            }
        }
    }
    function convertirMiles(n) {
        if (n < 1000) {
            return convertirCentenas(n);
        }
        else {
            const miles = Math.floor(n / 1000);
            const resto = n % 1000;
            if (miles === 1) {
                return "MIL " + convertirCentenas(resto);
            }
            else {
                return unidades[miles] + " MIL " + convertirCentenas(resto);
            }
        }
    }
    function convertirEntero(n) {
        if (n === 0) {
            return "CERO";
        }
        else if (n < 100) {
            return convertirDecenas(n);
        }
        else if (n < 1000) {
            return convertirCentenas(n);
        }
        else {
            return convertirMiles(n);
        }
    }
    const entero = Math.floor(numero);
    const decimal = Math.round((numero - entero) * 100);
    const parteEnteraLetras = convertirEntero(entero);
    const parteDecimalLetras = `${decimal.toString().padStart(2, '0')}/100`;
    return `${parteEnteraLetras.trim()} CON ${parteDecimalLetras} SOLES`;
}
exports.numeroALetras = numeroALetras;

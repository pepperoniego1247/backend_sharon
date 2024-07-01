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
const typeorm_1 = require("typeorm");
const token_1 = require("../middlewares/token");
const router = (0, express_1.Router)();
function obtenerSemanasDelMes(mes, ano) {
    let semanas = [];
    let primerDia = new Date(ano, mes, 1);
    let ultimoDia = new Date(ano, mes + 1, 0);
    let primerLunes = primerDia.getDate() - primerDia.getDay() + (primerDia.getDay() === 0 ? -6 : 1);
    for (let i = primerLunes; i <= ultimoDia.getDate(); i += 7) {
        let inicioSemana = new Date(ano, mes, i);
        let finSemana = new Date(ano, mes, i + 6 < ultimoDia.getDate() ? i + 6 : ultimoDia.getDate());
        semanas.push({ inicio: inicioSemana, fin: finSemana });
    }
    return semanas;
}
function getCurrentWeekDates() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const firstDayOfWeek = new Date(now);
    const lastDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - dayOfWeek);
    lastDayOfWeek.setDate(now.getDate() + (6 - dayOfWeek));
    const weekDates = [];
    for (let date = new Date(firstDayOfWeek); date <= lastDayOfWeek; date.setDate(date.getDate() + 1)) {
        weekDates.push(new Date(date));
    }
    return weekDates;
}
router.get("/dash_board_ingresos_totales_netos/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        const productSale = yield dataBase_1.appDataSource.getRepository("product_sale").sum("totalAmount", { date: (0, typeorm_1.Between)(startOfMonth, endOfMonth) });
        const reserveSale = yield dataBase_1.appDataSource.getRepository("sale").sum("totalAmount", { date: (0, typeorm_1.Between)(startOfMonth, endOfMonth) });
        if (!productSale || !reserveSale)
            return res.status(403).send({ message: "no existen ventas de productos" });
        return res.send({
            ingresosTotal: productSale + reserveSale,
            ingresosNeto: Math.round(((productSale + reserveSale) / (1 + 0.18)))
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "error en el interno del servidor" });
    }
}));
router.get("/dash_board_venta_por_semana/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth();
        const anoActual = fechaActual.getFullYear();
        const cantidadVentasPorSemana = [];
        const weeks = obtenerSemanasDelMes(mesActual, anoActual);
        for (const { inicio, fin } of weeks) {
            const ventas = yield dataBase_1.appDataSource.getRepository("product_sale").count({ where: { date: (0, typeorm_1.Between)(new Date(inicio), new Date(fin)) } });
            cantidadVentasPorSemana.push(ventas);
        }
        return res.send({
            weeks: weeks,
            salesPerWeek: cantidadVentasPorSemana
        });
    }
    catch (error) {
        console.error("Error al obtener ventas por semana:", error);
        res.status(500).json({ message: "Error al obtener ventas por semana" });
    }
}));
router.get("/dash_board_empleados_asignados/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cantidadReservasPorEmpleado = [];
        const nombresEmpleados = [];
        const employees = yield dataBase_1.appDataSource.getRepository("employee").find({ relations: ["person"] });
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        for (const { id, person } of employees) {
            const cantidadReservas = yield dataBase_1.appDataSource.getRepository("reserve").count({
                where: {
                    activo: false,
                    asignedEmployee: { id: id },
                    initionDate: (0, typeorm_1.Between)(startOfToday, endOfToday)
                }
            });
            cantidadReservasPorEmpleado.push(cantidadReservas);
            nombresEmpleados.push(`${person.firstName}`);
        }
        res.send({
            reservesPerEmployees: cantidadReservasPorEmpleado,
            empleados: nombresEmpleados
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener el tablero de empleados asignados" });
    }
}));
function getCurrentDatesWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const firstDayOfWeek = new Date(now);
    const lastDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - dayOfWeek);
    firstDayOfWeek.setHours(0, 0, 0, 0);
    lastDayOfWeek.setDate(now.getDate() + (6 - dayOfWeek));
    lastDayOfWeek.setHours(23, 59, 59, 999);
    const weekDates = [];
    for (let date = new Date(firstDayOfWeek); date <= lastDayOfWeek; date.setDate(date.getDate() + 1)) {
        weekDates.push(new Date(date));
    }
    return weekDates;
}
router.get("/dash_board_reservas_por_dia/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservePerDay = [];
        const days = getCurrentDatesWeek();
        for (const date of days) {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            const count = yield dataBase_1.appDataSource.getRepository("reserve").count({
                where: {
                    initionDate: (0, typeorm_1.Between)(startOfDay, endOfDay)
                }
            });
            reservePerDay.push(count);
        }
        return res.send({
            days: days.map(day => day.toISOString().split('T')[0]),
            reservesPerDay: reservePerDay
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}));
router.get("/dash_board_total_reservas_por_empleados/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cantidadReservasPorEmpleado = [];
        const nombresEmpleados = [];
        const employees = yield dataBase_1.appDataSource.getRepository("employee").find({ relations: ["person"] });
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        for (const { id, person } of employees) {
            const cantidadReservas = yield dataBase_1.appDataSource.getRepository("reserve").count({
                where: {
                    activo: false,
                    asignedEmployee: { id: id },
                    reserveDate: (0, typeorm_1.Between)(startOfMonth, endOfMonth)
                }
            });
            cantidadReservasPorEmpleado.push(cantidadReservas);
            nombresEmpleados.push(`${person.firstName}`);
        }
        res.send({
            reservesPerEmployees: cantidadReservasPorEmpleado,
            empleados: nombresEmpleados
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener el tablero de empleados asignados" });
    }
}));
router.get("/dash_board_venta_por_mes/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        const productSalePerMonth = yield dataBase_1.appDataSource.getRepository("product_sale").count({ where: { date: (0, typeorm_1.Between)(startOfMonth, endOfMonth) } });
        res.send({
            productSalePerMonth: productSalePerMonth
        });
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor!" });
    }
}));
router.get("/dash_board_productos_mas_vendidos_por_mes/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    const queryBuilder = dataBase_1.appDataSource.getRepository('product_sale')
        .createQueryBuilder('product_sale')
        .leftJoinAndSelect('product_sale.productSaleDetails', 'productSaleDetails')
        .where('product_sale.date BETWEEN :startOfMonth AND :endOfMonth', { startOfMonth, endOfMonth })
        .select([
        'productSaleDetails.name',
        'SUM(productSaleDetails.quantity) as totalQuantity'
    ])
        .groupBy('productSaleDetails.name')
        .orderBy('totalQuantity', 'DESC');
    const mostSoldProducts = yield queryBuilder.getRawMany();
    const productsName = mostSoldProducts.map(product => product.productSaleDetails_name);
    const productsQuantity = mostSoldProducts.map(product => parseInt(product.totalQuantity, 10));
    productsName.pop();
    productsQuantity.pop();
    return res.send({
        productsName,
        productsQuantity
    });
}));
router.get("/dash_board_total_reservas_por_mes/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    const totalReserves = yield dataBase_1.appDataSource.getRepository("reserve").count({ where: { reserveDate: (0, typeorm_1.Between)(startOfMonth, endOfMonth), activo: false } });
    return res.send({
        totalReserves: totalReserves
    });
}));
exports.default = router;

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
const token_1 = require("../middlewares/token");
const validateRequest_1 = require("../middlewares/validateRequest");
const dataBase_1 = require("../dataBase");
const router = (0, express_1.Router)();
function consultarDNI(dni) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer apis-token-8094.X49eLlyqb9vwzfxtgCAE9Py77iyebFYm`,
                }
            });
            if (!response.ok)
                throw new Error("HTTP ERROR EN RENIEC");
            return response.json();
        }
        catch (error) {
            console.error("Error al consultar el DNI:", error);
            throw error;
        }
    });
}
router.post("/employee/register/", (0, express_validator_1.checkSchema)({
    dni: {
        in: ["body"],
        isNumeric: { errorMessage: "el dni debe ser numerico" },
        notEmpty: true,
        errorMessage: "el campo dni no puede estar vacio"
    },
    phoneNumber: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "datos del numero celular erroneos"
    },
    role: {
        in: ["body"],
        isAlpha: true,
        notEmpty: true,
        custom: {
            options: (value) => value === "Administrador" || value === "Cajero" || value === "Estilista" || value === "Cosmetologo"
        },
        errorMessage: "se ha ingresado un rol no valido"
    },
    activo: {
        in: ["body"],
        custom: {
            options: (value) => value === true || value === false
        },
        errorMessage: "el estado deber ser un booleano",
    }
}), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const personAlreadyExists = await appDataSource.getRepository("person").findOne({ where: { dni: req.body["dni"] } });
        // if (personAlreadyExists) return res.status(403).send({ message: "esta persona ya esta registrada" });
        const dniResponse = yield consultarDNI(req.body["dni"]);
        const nombresLista = dniResponse['nombres'].split(" ");
        nombresLista.forEach((nombre, index) => nombresLista[index] = nombre[0] + nombre.slice(1, nombre.length).toLowerCase());
        req.body["firstName"] = nombresLista.join(" ");
        req.body["lastName"] = `${dniResponse["apellidoPaterno"][0]}${dniResponse["apellidoPaterno"].slice(1, dniResponse["apellidoPaterno"].length).toLowerCase()} ${dniResponse["apellidoMaterno"][0]}${dniResponse["apellidoMaterno"].slice(1, dniResponse["apellidoMaterno"].length).toLowerCase()}`;
        const person = __rest(req.body, []);
        const newPerson = Object.assign({}, person);
        const employeePerson = yield dataBase_1.appDataSource.getRepository("person").save(newPerson);
        const asignedRole = yield dataBase_1.appDataSource.getRepository("role").findOne({ where: { name: req.body["role"] } });
        const employee = __rest({
            role: asignedRole,
            person: employeePerson
        }, []);
        const newEmployee = Object.assign({}, employee);
        const data = yield dataBase_1.appDataSource.getRepository("employee").save(newEmployee);
        return res.send({
            message: "se ha creado con exito el empleado!",
            data: data
        });
    }
    catch (error) {
        return res.status(500).send({ message: "error interno en el servidor" });
    }
}));
router.get("/employee/get_all/", token_1.validationToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dataBase_1.appDataSource.getRepository("employee").find({ relations: ["role", "person"] });
        return res.send(data);
    }
    catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}));
router.get("/employee/get_by_id/:id", (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("verifique el id pasado como parametro"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeExists = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { id: req.params["id"] }, relations: ["role", "person"] });
        if (!employeeExists)
            return res.status(403).send({ message: "el empleado no existe" });
        return res.send({
            employee: employeeExists
        });
    }
    catch (error) {
        return res.status(500).send({ message: "ha ocurrido un error en la base de datos" });
    }
}));
router.put("/employee/update_employee_by_id/:id", (0, express_validator_1.checkSchema)({
    dni: {
        in: ["body"],
        isNumeric: { errorMessage: "el dni debe ser numerico" },
        notEmpty: true,
        errorMessage: "el campo dni no puede estar vacio"
    },
    phoneNumber: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
        errorMessage: "datos del numero celular erroneos"
    },
    role: {
        in: ["body"],
        isAlpha: true,
        notEmpty: true,
        custom: {
            options: (value) => value === "Administrador" || value === "Cajero" || value === "Estilista" || value === "Cosmetologo"
        },
        errorMessage: "se ha ingresado un rol no valido"
    },
    activo: {
        in: ["body"],
        custom: {
            options: (value) => value === true || value === false
        },
        errorMessage: "el estado deber ser un booleano",
    }
}), (0, express_validator_1.param)("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("verifique el id pasado como parametro"), validateRequest_1.validateReq, token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeExists = yield dataBase_1.appDataSource.getRepository("employee").findOne({ where: { id: req.params["id"] }, relations: ["role", "person"] });
    if (!employeeExists)
        return res.status(403).send({ message: "el empleado no existe" });
    const newRole = yield dataBase_1.appDataSource.getRepository("role").findOne({ where: { name: req.body["role"] } });
    delete req.body["role"];
    yield dataBase_1.appDataSource.getRepository("employee").update({ id: req.params["id"] }, { role: newRole });
    yield dataBase_1.appDataSource.getRepository("person").update({ id: employeeExists["person"]["id"] }, { activo: req.body["activo"], phoneNumber: req.body["phoneNumber"] });
    return res.send({ message: "el empleado se ha actualizado!" });
}));
router.get("/employee/get_all_dni/", token_1.validationToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allDni = [];
        const employees = [];
        const employeesWithUser = [];
        const data = yield dataBase_1.appDataSource.getRepository("employee").find({ relations: ["person"] });
        data.forEach((employee) => employees.push(employee["person"]["firstName"]));
        const user = yield dataBase_1.appDataSource.getRepository("user").find({ relations: ["employee", "employee.person"] });
        user.forEach((user) => {
            const { employee } = user;
            const { person } = employee;
            employeesWithUser.push(person["firstName"]);
        });
        const newData = employees.filter((employee) => !employeesWithUser.find((employeeTemp) => employeeTemp === employee));
        const promises = newData.map((name) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield dataBase_1.appDataSource.getRepository("person").findOne({ where: { firstName: name } });
            if (data)
                allDni.push(data["dni"]);
        }));
        yield Promise.all(promises);
        return res.send(allDni);
    }
    catch (error) {
        return res.status(500).send({ message: "Error interno en el servidor!" });
    }
}));
exports.default = router;

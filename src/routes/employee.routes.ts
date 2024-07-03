import { Router, Request, Response } from "express";
import { checkSchema, param } from "express-validator";
import { validationToken } from "../middlewares/token"
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreateEmployee } from "../interfaces/employee";
import { ICreatePerson } from "../interfaces/person";

const router = Router();

async function consultarDNI(dni: string) {
    try {
        const response = await fetch(`https://api.apis.net.pe/v2/reniec/dni?numero=${ dni }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer apis-token-8094.X49eLlyqb9vwzfxtgCAE9Py77iyebFYm`,
            }
        });

        if (!response.ok) throw new Error("HTTP ERROR EN RENIEC");
        return response.json();

    } catch (error) {
        console.error("Error al consultar el DNI:", error);
        throw error;
    }
}

router.post("/employee/register/", 
    checkSchema({
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
                options: (value: string) => value === "Administrador" || value === "Cajero" || value === "Estilista" || value === "Cosmetologo"
            },
            errorMessage: "se ha ingresado un rol no valido"
        },
        activo: {
            in: ["body"],
            custom: {
                options: (value: boolean) => value === true || value === false
            },
            errorMessage: "el estado deber ser un booleano",
        }
    }), 
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const personAlreadyExists = await appDataSource.getRepository("person").findOne({ where: { dni: req.body["dni"] } });
            if (personAlreadyExists) return res.status(403).send({ message: "esta persona ya esta registrada" });
    
            const dniResponse = await consultarDNI(req.body["dni"])
            const nombresLista = dniResponse['nombres'].split(" ");

            nombresLista.forEach((nombre: string, index: number) => nombresLista[index] = nombre[0] + nombre.slice(1, nombre.length).toLowerCase());
            req.body["firstName"] = nombresLista.join(" ");
            req.body["lastName"] = `${ dniResponse["apellidoPaterno"][0] }${ dniResponse["apellidoPaterno"].slice(1, dniResponse["apellidoPaterno"].length).toLowerCase() } ${ dniResponse["apellidoMaterno"][0] }${ dniResponse["apellidoMaterno"].slice(1, dniResponse["apellidoMaterno"].length).toLowerCase() }`;

            const { ...person } = req.body;
            const newPerson: ICreatePerson = <ICreatePerson>(<unknown> { ...person });
            const employeePerson = await appDataSource.getRepository("person").save(newPerson);
            const asignedRole = await appDataSource.getRepository("role").findOne({ where: { name: req.body["role"] } });
    
            const { ...employee } = { 
                role: asignedRole,
                person: employeePerson
            }
    
            const newEmployee: ICreateEmployee = <ICreateEmployee>(<unknown> { ...employee } );
            const data = await appDataSource.getRepository("employee").save(newEmployee);
    
            return res.send({
                message: "se ha creado con exito el empleado!",
                data: data
            });
        } catch (error) {
            return res.status(500).send({ message: "error interno en el servidor" });
        }
    }
);

router.get("/employee/get_all/", 
    validationToken,
    async (_: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("employee").find({ relations: ["role", "person"] });
            return res.send(data);
        } catch (error) {
            return res.status(500).send({
                message: error
            });
        }
    }
);

router.get("/employee/get_by_id/:id", 
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("verifique el id pasado como parametro"),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const employeeExists = await appDataSource.getRepository("employee").findOne({ where: { id: req.params["id"] }, relations: ["role", "person"] });
            if (!employeeExists) return res.status(403).send({ message: "el empleado no existe" });
        
            return res.send({
                employee: employeeExists
            });
        } catch (error) {
            return res.status(500).send({ message: "ha ocurrido un error en la base de datos" });
        }
    }
);

router.put("/employee/update_employee_by_id/:id",
    checkSchema({
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
                options: (value: string) => value === "Administrador" || value === "Cajero" || value === "Estilista" || value === "Cosmetologo"
            },
            errorMessage: "se ha ingresado un rol no valido"
        },
        activo: {
            in: ["body"],
            custom: {
                options: (value: boolean) => value === true || value === false
            },
            errorMessage: "el estado deber ser un booleano",
        }
    }),
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("verifique el id pasado como parametro"),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        const employeeExists = await appDataSource.getRepository("employee").findOne({ where: { id: req.params["id"] }, relations: ["role", "person"] });
        if (!employeeExists) return res.status(403).send({ message: "el empleado no existe" });

        const newRole = await appDataSource.getRepository("role").findOne({ where: { name: req.body["role"] } });
        delete req.body["role"];

        await appDataSource.getRepository("employee").update({ id: req.params["id"] }, { role: newRole });
        await appDataSource.getRepository("person").update({ id: employeeExists["person"]["id"] }, { activo: req.body["activo"], phoneNumber: req.body["phoneNumber"] });
        
        return res.send({ message: "el empleado se ha actualizado!" });
    }
);

router.get("/employee/get_all_dni/", 
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const allDni: any[] = [];
            const employees: string[] = [];
            const employeesWithUser: string[] = [];
    
            const data = await appDataSource.getRepository("employee").find({ relations: ["person"] });
            data.forEach((employee: any) => employees.push(employee["person"]["firstName"]));
                            
            const user = await appDataSource.getRepository("user").find({ relations: ["employee", "employee.person"] });
            user.forEach((user) => {
                const { employee } = user;
                const { person } = employee;
                employeesWithUser.push(person["firstName"]);
            });
    
            const newData = employees.filter((employee: string) => !employeesWithUser.find((employeeTemp) => employeeTemp === employee));
    
            const promises = newData.map(async (name: string) => {
                const data: any = await appDataSource.getRepository("person").findOne({ where: { firstName: name } });
                if (data) allDni.push(data["dni"]);
            });
    
            await Promise.all(promises);
    
            return res.send(allDni);
        } catch (error) {
            return res.status(500).send({ message: "Error interno en el servidor!" });
        }
    }
);

export default router;
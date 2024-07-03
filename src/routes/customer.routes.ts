import { Router, Request, Response } from "express";
import { check, checkSchema, param } from "express-validator";
import { validationToken } from "../middlewares/token";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import * as dotenv from "dotenv";
import { ICreatePerson } from "../interfaces/person";
import { ICreateCustomer } from "../interfaces/customer";

const router = Router();
dotenv.config();

async function consultarDNI(dni: string) {
    try {
        const response = await fetch(`https://api.apis.net.pe/v2/reniec/dni?numero=${ dni }`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ process.env.API_RENIEC_TOKEN! }`,
            },
        });

        if (!response.ok) throw new Error("HTTP ERROR EN RENIEC");
        return response.json();

    } catch (error) {
        console.error("Error al consultar el DNI:", error);
        throw error;
    }
}

router.post("/customer/register/", 
    checkSchema({
        dni: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo dni no puede estar vacio"
        },
        firstName: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo firstname ha tenido un error"
        },
        lastName: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo lastname ha tenido un error"
        },
        phoneNumber: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "datos del numero celular erroneos"
        },
        notation: {
            in: ["body"],
            optional: true,
            isString: true,
            errorMessage: "error en el campo notacion!"
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
            const conditional: any = {};
            (req.body["dni"] !== "") ? conditional["dni"] = req.body["dni"] : conditional["firstName"] = req.body["firstName"]; 

            const data = await appDataSource.getRepository("person").findOne({ where: { ...conditional } });
            if (data) return res.status(403).send({ message: "el cliente ya existe" });
            
            if (req.body["dni"] !== "") {
                const dniResponse = await consultarDNI(req.body["dni"]);
                
                const nombresLista = dniResponse['nombres'].split(" ");
                nombresLista.forEach((nombre: string, index: number) => nombresLista[index] = nombre[0] + nombre.slice(1, nombre.length).toLowerCase());
                req.body["firstName"] = nombresLista.join(" ");
                req.body["lastName"] = `${ dniResponse["apellidoPaterno"][0] }${ dniResponse["apellidoPaterno"].slice(1, dniResponse["apellidoPaterno"].length).toLowerCase() } ${ dniResponse["apellidoMaterno"][0] }${ dniResponse["apellidoMaterno"].slice(1, dniResponse["apellidoMaterno"].length).toLowerCase() }`;
            }
    
            const { ...newPerson} = req.body;
            const newCreatedPerson: ICreatePerson = <ICreatePerson>(<unknown> { ...newPerson });
            const personCreated = await appDataSource.getRepository("person").save(newCreatedPerson);
            
            //! CONSIDERAR HACER EMAIL OPCIONAL

            const { ...newCustomer } = {
                person: personCreated,
                notation: req.body["notation"]
            }

            const newCreatedCustomer: ICreateCustomer = <ICreateCustomer>(<unknown> { ...newCustomer });
            const newCustomerCreated = await appDataSource.getRepository("customer").save(newCreatedCustomer);

            return res.send(newCustomerCreated);
        } catch (error) {
            return res.status(500).send(error);
        }
    }
);

router.get("/customer/get_all/", 
    validationToken,
    async (_: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("customer").find({ relations: ["person"] });
            return res.send(data);
        } catch (error) {
            return res.status(500).send(error);
        }
});

router.put("/customer/update_by_id/:id", 
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("verifique el id pasado como parametro"),
    checkSchema({
        dni: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo dni no puede estar vacio"
        },
        firstName: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo firstname ha tenido un error"
        },
        lastName: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo lastname ha tenido un error"
        },
        phoneNumber: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "datos del numero celular erroneos"
        },
        notation: {
            in: ["body"],
            optional: true,
            isString: true,
            errorMessage: "error en el campo notacion!"
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
            //! SOLO SE PUEDE MODIFICAR TELEFONO, ESTADO Y EMAIL
            const customerExists = await appDataSource.getRepository("customer").findOne({ where: { id: req.params["id"] }, relations: ["person"] });
            if (!customerExists) return res.status(403).send({ message: "el cliente no existe!" });
            
            const personExists = await appDataSource.getRepository("person").findOne({ where: { id: customerExists["person"]["id"] } });
            if (!personExists) return res.status(403).send({ message: "los datos del cliente son inexistentes" });

            if (req.body["dni"]) {
                const dniResponse = await consultarDNI(req.body["dni"]);
                
                const nombresLista = dniResponse['nombres'].split(" ");
                nombresLista.forEach((nombre: string, index: number) => nombresLista[index] = nombre[0] + nombre.slice(1, nombre.length).toLowerCase());
                req.body["firstName"] = nombresLista.join(" ");
                req.body["lastName"] = `${ dniResponse["apellidoPaterno"][0] }${ dniResponse["apellidoPaterno"].slice(1, dniResponse["apellidoPaterno"].length).toLowerCase() } ${ dniResponse["apellidoMaterno"][0] }${ dniResponse["apellidoMaterno"].slice(1, dniResponse["apellidoMaterno"].length).toLowerCase() }`;
            }

            const { notation } = req.body;
            delete req.body["notation"];

            const { ...newDataPerson } = req.body;
            const newDataUpdated: ICreatePerson = <ICreatePerson>(<unknown> { ...newDataPerson });
            
            await appDataSource.getRepository("customer").update({ id: req.params["id"] }, { notation: notation });
            const response = await appDataSource.getRepository("person").update({ id: customerExists["person"]["id"] }, { ...newDataUpdated });

            return res.send(response);
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor!" });
        }
    }
);

export default router;
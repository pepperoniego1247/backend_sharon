import { Router, Request, Response } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreateProvider } from "../interfaces/provider";
import { Provider } from "../entities/provider";
import * as dotenv from "dotenv";
import { validationToken } from "../middlewares/token";


const router = Router();
dotenv.config();

router.post("/provider/register/",
    checkSchema({
        ruc: {
            in: ["body"],
            isNumeric: true,
            optional: { options: { nullable: true, checkFalsy: true } },
            errorMessage: "datos invalidos en el ruc"
        },
        address: {
            in: ["body"],
            optional: { options: { nullable: true, checkFalsy: true } },
            isString: true,
            errorMessage: "datos invalidos en la direccion"

        },
        name: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "datos invalidos en el nombre"
        },
        phoneNumber: {
            in: ["body"],
            optional: { options: { nullable: true, checkFalsy: true } },
            isNumeric: true,
            errorMessage: "datos invalidos en el telefono"
        },
        activo: {
            in: ["body"],
            isBoolean: true,
            errorMessage: "datos invalidos en activo"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const provider = await appDataSource.getRepository("provider").findOne({ where: { name: req.body["name"] } });
            if (provider) return res.status(403).send({ message: "el proveedor ya existe!" });
            
            const { ...newProvider} = req.body;
            const newProviderData = <ICreateProvider>(<unknown> { ...newProvider });
            const data = await appDataSource.getRepository("provider").save(newProviderData);
        
            return res.send(data);
        } catch (error) {
            return res.status(500).send({ message: "ha ocurrido un error interno", error: error });
        }
    }
);

router.get("/provider/get_all/", 
    validationToken,
    async (_: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("provider").find();
            return res.send(data);
        } catch (error) {
            return res.status(500).send({ message: "error interno en el servidor" });
        }
    }
);

router.get("/provider/get_by_id/:id", 
    param("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro id es erroneo"),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        const data = await appDataSource.getRepository("provider").findOne({ where: { id: req.params["id"]} });
        if (!data) return res.status(403).send({ message: "el proveedor no existe!" });
        return res.send(data);
    }
);

router.put("/provider/update_by_id/:id", 
    checkSchema({
        ruc: {
            in: ["body"],
            optional: { options: { nullable: true, checkFalsy: true } },
            isNumeric: true,
            errorMessage: "datos invalidos en el ruc"
        },
        address: {
            in: ["body"],
            optional: { options: { nullable: true, checkFalsy: true } },
            isString: true,
            errorMessage: "datos invalidos en la direccion"

        },
        name: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "datos invalidos en el nombre"
        },
        phoneNumber: {
            in: ["body"],
            optional: { options: { nullable: true, checkFalsy: true } },
            isNumeric: true,
            errorMessage: "datos invalidos en el telefono"
        },
        activo: {
            in: ["body"],
            isBoolean: true,
            errorMessage: "datos invalidos en activo"
        }
    }),
    param("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro id es erroneo"),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("provider").findOne({ where: { id: req.params["id"]} });
            if (!data) return res.status(403).send({ message: "el proveedor no existe!" });
    
            const { ...updateProvider } = req.body;
            const newUpdateProvider: ICreateProvider = <ICreateProvider>(<unknown> { ...updateProvider });
            const { ruc,address,name,phoneNumber, activo } = newUpdateProvider;
            const response = await appDataSource.getRepository("provider").update({ id: data["id"] }, { ruc:ruc, address:address, name: name, phoneNumber: phoneNumber, activo: activo});
            
            return res.send(response);
        } catch (error) {
            return res.status(500).send({ message: "error interno en el servidor" });
        }
    }
);

export default router;


import { Router, Request, Response } from "express";
import * as dotenv from "dotenv";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreateMicroService } from "../interfaces/microService";
import { UpdateMicroService } from "../interfaces/microService";
import { validationToken } from "../middlewares/token";

const router = Router();
dotenv.config();

router.post("/micro_services/register/", 
    checkSchema({
        name: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "ingrese datos validos para el nombre"
        },
        price: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "el campo de precio no puede estar vacio"
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
            const microService = await appDataSource.getRepository("micro_service").findOne({ where: { name: req.body["name"] } });
            if (microService) return res.status(403).send({ message: "el microservicio ya existe" });
            
            const { ...newMicroService } = req.body;
            const newMicroServiceData = <ICreateMicroService>(<unknown> { ...newMicroService });
            const data = await appDataSource.getRepository("micro_service").save(newMicroServiceData);
        
            return res.send(data);
        } catch (error) {
            return res.status(500).send({ message: "ha ocurrido un error interno", error: error });
        }
    }
);


router.get("/micro_services/get_all/", 
    validationToken,
    async (_: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("micro_service").find({ relations: ["service"] });
            return res.send(data);
        } catch (error) {
            return res.status(500).send({ message: "error interno en el servidor" });
        }
    }
);

router.put("/micro_services/update_by_id/:id", 
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("el parametro id es erroneo"),
    checkSchema({
        name: {
            in: ["body"],
            isString: true,
            errorMessage: "ha ocurrido un error en el campo nombre"
        },
        price: {
            in: ["body"],
            isNumeric: true,
            optional: true,
            errorMessage: "ha ocurrido un error en el campo precio"
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
            const data = await appDataSource.getRepository("micro_service").findOne({ where: { id: req.params["id"] } });
            if (!data) return res.status(401).send({ message: "el microservicio no existe!!" });

            (req.body["service"] == null) ? req.body["service"] = "" : null;
            const asignedService = await appDataSource.getRepository("service").findOne({ where: { description: req.body["service"]} });
            (asignedService) ? req.body["service"] = asignedService : req.body["service"] = null;

            const { ...updateMicroService } = req.body;
            const newUpdatedMicroServices: UpdateMicroService = <UpdateMicroService>(<unknown> { ...updateMicroService });

            const { name, price, service, activo } = newUpdatedMicroServices;

            const response = await appDataSource.getRepository("micro_service").update({ id: req.params["id"] }, { name: name, price: price, service: service, activo: activo });
            
            return res.send(response);
        } catch (error) {
            return res.status(500).send(error);
        }
    }
);

export default router;
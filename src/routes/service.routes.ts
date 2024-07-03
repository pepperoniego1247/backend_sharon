import { validationToken } from "../middlewares/token";
import { Router, Request, Response } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreateService } from "../interfaces/service";

const router = Router();

router.post("/services/register/", 
//!! CAMBIAR PARA QUE SE REGISTRE ESTO Y POR UN ARRAY CON MICROSERVICIOS
    checkSchema({
        description: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo descripcion!"
        },
        price: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo precio!"
        },
        microServices: {
            in: ["body"],
            isArray: true,
            notEmpty: true,
            errorMessage: "error en el campo micro servicios"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("service").findOne({ where: { description: req.body["description"] } });
            if (data) return res.status(403).send({ message: "el servicio ya existe" });

            const { ...newService } = req.body;
            const newServiceCreated: ICreateService = <ICreateService>(<unknown> { ...newService });
            const response = await appDataSource.getRepository("service").save(newServiceCreated);

            req.body["microServices"].forEach(async (name: string) => {
                const microService = await appDataSource.getRepository("micro_service").findOne({ where: { name: name } });
                if (microService!["service"]) return res.status(403).send({ message: "El microservicio ya esta asignado" });
            });
            
            req.body["microServices"].forEach(async (name: string) => {
                await appDataSource.getRepository("micro_service").update({ name: name }, { service: response });
            });

            return res.send(response);
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor: ", error });
        }
    }
);

router.get("/services/get_all/", 
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("service").find({ relations: ["microServices"] });
            return res.send(data);
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor" });
        }
    }
);

router.put("/services/update_by_id/:id", 
    checkSchema({
        description: {
            in: ["body"],
            isAlphanumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo descripcion!"
        },
        price: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo precio!"
        },
        microServices: {
            isArray: true,
            notEmpty: true,
            errorMessage: "error en el campo services"
        }
    }),
    param("id")
        .notEmpty()
        .isNumeric({ no_symbols: true })
        .withMessage("el id es invalido!"),
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const serviceAlreadyExists = await appDataSource.getRepository("service").findOne({ where: { id: req.params["id"] } });
            if (!serviceAlreadyExists) return res.status(403).send({ message: "el servicio no existe!" });

            const { microServices } = req.body;
            delete req.body["microServices"];

            const newUpdatedService: ICreateService = <ICreateService>(<unknown> { ...req.body })
            const updatedService = await appDataSource.getRepository("service").update({ id: req.params["id"] }, { ...newUpdatedService });

            microServices.forEach(async (service: string) => {
                const micro: any = await appDataSource.getRepository("micro_service").find({ where: { name: service } });
                if (micro["service"]) return res.status(403).send({ message: "error al asignar un nuevo microservicio" });
            });

            microServices.forEach(async (service: string) => await appDataSource.getRepository("micro_service").update({ name: service }, { service: req.params["id"] }));
            const data = await appDataSource.getRepository("service").findOne({ where: { id: req.params["id"] } });

            return res.send(data);
        } catch (error) {
            return res.status(500).send({ message: "ocurrio un error en el servidor!" });
        }
    } 
);

export default router;
import { Router, Request, Response } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreateRole, UpdateRole } from "../interfaces/role";
import { validationToken } from "../middlewares/token";

const router = Router();

router.post("/role/register/", 
    checkSchema({
        name: {
            in: ["body"],
            isAlphanumeric: true,
            notEmpty: true,
            errorMessage: "datos invalidos en el nombre"
        },
        payment: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo de pago"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const role = await appDataSource.getRepository("role").findOne({ where: { name: req.body["name"] } });
            if (role) return res.status(403).send({ message: "el rol ya existe!" });

            const { ...tempRole } = req.body;
            const newRole: ICreateRole = <ICreateRole>(<unknown> { ...tempRole });
            const data = await appDataSource.getRepository("role").save(newRole);

            return res.send(data);
        } catch (error) {
            return res.status(500).send({ message: "ha ocurrido un error interno" });
        }
    }
);

router.get("/role/get_all/", 
    validationToken,
    async (_: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("role").find();
            return res.send(data);
        } catch (error) {
            return res.status(500).send({ message: "error interno en el servidor" });
        }
    }
);

router.get("/role/get_by_id/:id", 
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("el parametro id es erroneo"),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        const data = await appDataSource.getRepository("role").findOne({ where: { id: req.params["id"]} });
        if (!data) return res.status(403).send({ message: "el role no existe!" });

        return res.send(data);
    }
);

router.put("/role/update_by_id/:id", 
    checkSchema({
        name: {
            notEmpty: true,
            isAlpha: true,  
            errorMessage: "error en el campo name!"
        },
        payment: {
            isNumeric: true,
            notEmpty: true,
            errorMessage: "el campo pago no puede tener valores invalidos!"
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
            const data = await appDataSource.getRepository("role").findOne({ where: { id: req.params["id"]} });
            if (!data) return res.status(403).send({ message: "el role no existe!" });
    
            const { ...updateRole } = req.body;
            const newUpdateRole: UpdateRole = <UpdateRole>(<unknown> { ...updateRole });
            const { name, payment } = newUpdateRole;
            const response = await appDataSource.getRepository("role").update({ id: data["id"] }, { name: name, payment: payment});
            
            return res.send(response);
        } catch (error) {
            return res.status(500).send({ message: "error interno en el servidor" });
        }
    }
);

export default router;
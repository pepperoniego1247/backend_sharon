import { Router, Request, Response } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreateProduct } from "../interfaces/product";
import { validationToken } from "../middlewares/token";
import { TreeLevelColumn } from "typeorm";

const router = Router();

router.post("/product/register/", 
    checkSchema({
        name: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "error en el campo nombre"
        },
        category: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "error en el campo categoria"
        },
        price: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo precio"
        },
        description: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo descripcion"
        },
        cantidad: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo cantidad"
        },
        activo: {
            in: ["body"],
            isBoolean: true,
            notEmpty: true,
            errorMessage: "error en el campo activo"
        },
        image: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo image"
        },
        comerciable: {
            in: ["body"],
            isBoolean: true,
            notEmpty: true,
            errorMessage: "error en el campo comerciable"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const productAlreadyExists = await appDataSource.getRepository("product").findOne({ where: { name: req.body["name"] } });
            if (productAlreadyExists) return res.status(403).send({ message: "el producto ya existe!" });

            const { ...newProduct } = {
                name: req.body["name"],
                category: req.body["category"],
                price: req.body["price"],
                description: req.body["description"],
                image: req.body["image"],
                cantidad: req.body["cantidad"],
                activo: req.body["activo"],
                comerciable: req.body["comerciable"]
            }

            const newProductCreated: ICreateProduct = <ICreateProduct>(<unknown> { ...newProduct });
            const product = await appDataSource.getRepository("product").save(newProductCreated);

            return res.send(product);
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor!" });
        }
    }
);

router.get("/product/get_all/", 
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const allData = await appDataSource.getRepository("product").find();
            return res.send(allData);
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor!" });
        }
    }
);

router.put("/product/update_by_id/:id",
    checkSchema({
        name: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "error en el campo nombre"
        },
        category: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "error en el campo categoria"
        },
        description: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo descripcion"
        },
        price: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo precio"
        },
        cantidad: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo cantidad"
        },
        image: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo image"
        },
        activo: {
            in: ["body"],
            isBoolean: true,
            notEmpty: true,
            errorMessage: "error en el campo activo"
        },
        comerciable: {
            in: ["body"],
            isBoolean: true,
            notEmpty: true,
            errorMessage: "error en el campo comerciable"
        }
    }),
    param("id")
        .notEmpty()
        .isNumeric({ no_symbols: true })
        .withMessage("error en el parametro id"),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const productExists = await appDataSource.getRepository("product").find({ where: { id: req.params["id"] } });
            if (!productExists) return res.status(403).send({ message: "no existe el producto!" });

            const { ...newUpdateProduct } = req.body;
            const newProductUpdated: ICreateProduct = <ICreateProduct>(<unknown> { ...newUpdateProduct });

            const update = await appDataSource.getRepository("product").update({ id: req.params["id"] }, { ...newProductUpdated });
            return res.send(update);
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor!" });
        }
    }
);

export default router;
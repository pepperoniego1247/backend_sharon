import { validationToken } from "../middlewares/token";
import { Router, Request, Response } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreatePromotion } from "../interfaces/promotion";
import { ICreatePromotionDetail } from "../interfaces/promotionDetail";

const router = Router();

router.post("/promotion/register/",

    checkSchema({
        name: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "error en el campo name"
        },
        precio: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo precio"
        },
        promotionDetails: {
            in: ["body"],
            notEmpty: true,
            isArray: true,
            errorMessage: "error en el campo promotionDetail"
        },
        activo: {
            in: ["body"],
            isBoolean: true,
            notEmpty: true,
            errorMessage: "error en el campo activo"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const promotionAlreadyExists = await appDataSource.getRepository("promotion").findOne({ where: { name: req.body["name"] } });
            if (promotionAlreadyExists) return res.status(403).send({ message: "la promocion ya existe!" });

            const { ...newPromotion } = {
                name: req.body["name"],
                precio: req.body["precio"],
                activo: req.body["activo"]
            }

            const newPromotionCreated: ICreatePromotion = <ICreatePromotion>(<unknown> { ...newPromotion });
            const promotion = await appDataSource.getRepository("promotion").save(newPromotionCreated);
            
            const { ...newPromotionDetail } = { promotion: promotion }
            const { promotionDetails } = req.body;

            
            promotionDetails.forEach(async (name: string) => {
                const newPromotionDetailCreated: ICreatePromotionDetail = <ICreatePromotionDetail>(<unknown> { ...newPromotionDetail });
                newPromotionDetailCreated["service"] = await appDataSource.getRepository("service").findOne({ where: { description: name } });
                await appDataSource.getRepository("promotion_detail").save(newPromotionDetailCreated);
            });
            
            const promotionN = await appDataSource.getRepository("promotion").findOne({ where: { id: promotion["id"] }, relations: ["promotionDetails"] });
            return res.send(promotionN);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "error en el servidor" });
        }
    }
);

router.get("/promotion/get_all/", 
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const allData = await appDataSource.getRepository("promotion").find({ relations: ["promotionDetails", "promotionDetails.service"] });
            return res.send(allData);
        } catch (error) {
            return res.status(500).send({ error: error });
        }
    }
);

router.put("/promotion/update_by_id/:id", 
    checkSchema({
        name: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            errorMessage: "error en el campo name"
        },
        precio: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo precio"
        },
        promotionDetails: {
            in: ["body"],
            notEmpty: true,
            isArray: true,
            errorMessage: "error en el campo promotionDetail"
        },
        activo: {
            in: ["body"],
            isBoolean: true,
            notEmpty: true,
            errorMessage: "error en el campo activo"
        }
    }),
    validateReq,
    validationToken,
    param("id")
        .notEmpty()
        .isNumeric({ no_symbols: true }),
    async (req: Request, res: Response) => {
        try {
            const promotionExists = await appDataSource.getRepository("promotion").findOne({ where: { id: req.params["id"] }, relations: ["promotionDetails"] });
            if (!promotionExists) return res.status(403).send({ message: "la promocion no existe!!" });

            const { ...updatePromotion } = {
                name: req.body["name"],
                precio: req.body["precio"],
                activo: req.body["activo"]
            }

            const updateNewPromotion: ICreatePromotion = <ICreatePromotion>(<unknown> { ...updatePromotion });
            await appDataSource.getRepository("promotion").update({ id: req.params["id"] }, { ...updateNewPromotion });
            const { ...newPromotionDetailCreated } = { promotion: promotionExists }
            
            req.body["promotionDetails"].forEach(async (name: any) => {
                const newPromotionDetail: ICreatePromotionDetail = <ICreatePromotionDetail>(<unknown> { ...newPromotionDetailCreated });
                newPromotionDetail["service"] = await appDataSource.getRepository("service").findOne({ where: { description: name } });
                await appDataSource.getRepository("promotion_detail").save(newPromotionDetail);
            });

            promotionExists["promotionDetails"].forEach(async (detail: any) => await appDataSource.getRepository("promotion_detail").delete(detail["id"]));

            return res.send({ message: "se actualizo correctamente!!!" });
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor!" });
        }
    }
);

export default router;
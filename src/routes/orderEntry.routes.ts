import { Router, Response, Request } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { ICreateOrderEntry } from "../interfaces/orderEntry";
import { ICreateOrderEntryDetail } from "../interfaces/orderEntryDetail";
import { appDataSource } from "../dataBase";
import { create } from "domain";

const router = Router();

router.post("/order_entry/register/",
    checkSchema({
        date: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "el campo date no puede estar vacio!"
        },
        activo: {
            in: ["body"],
            isBoolean: true,
            notEmpty: true,
            errorMessage: "el campo activo esta mal!"
        },
        employee: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo empleado!"
        },
        orderEntryDetails: {
            in: ["body"],
            isArray: true,
            notEmpty: true,
            errorMessage: "error en el campo detalle!"
        },
        provider: {
            in: ["body"],
            isArray: true,
            notEmpty: true,
            errorMessage: "el campo providers tuvo un error!"
        }
    }),
    async (req: Request, res: Response) => {
        try {
            const employee = await appDataSource.getRepository("employee").findOne({ where: { person: { firstName: req.body["employee"] } }, relations: ["person"] });
            if (!employee) return res.status(403).send({ message: "el empleado no existe!" });

            const provider = await appDataSource.getRepository("provider").findOne({ where: { name: req.body["provider"] } });
            if (!provider) return res.status(403).send({ message: "el proveedor no existe!" });

            const { orderEntryDetails } = req.body;
            delete req.body["orderEntryDetails"];

            const { ...newOrderEntry } = {
                date: req.body["date"],
                activo: req.body["activo"],
                employee: employee,
                provider: provider
            };
            const createdOrderEntry: ICreateOrderEntry = <ICreateOrderEntry>(<unknown>{ ...newOrderEntry });
            const orderEntry = await appDataSource.getRepository("order_entry").save(createdOrderEntry);

            for (let detail of orderEntryDetails) {

                const product = await appDataSource.getRepository("product").findOne({ where: { name: detail.name } });
                if (!product) return res.status(403).send({ message: "el producto no existe!" });
                if (detail.quantity < 0) return res.status(403).send({ message: "la cantidad no puede ser menor que cerapio!!!" });
                const { ...newDetail } = {
                    name: detail.name,
                    quantity: detail.quantity,
                    orderEntry: orderEntry,
                    product: product
                }
                const createDetail: ICreateOrderEntryDetail = <ICreateOrderEntryDetail>(<unknown>{ ...newDetail });
                const orderDetail = await appDataSource.getRepository("order_entry_detail").save(createDetail);

                if (!orderDetail) return res.status(403).send({ message: "Error en el detalle" });

                let entrada = Number(product.cantidad) + Number(orderDetail.quantity);
                const updateData = await appDataSource.getRepository("product").update(product.id, { cantidad: entrada });
                if (!updateData) return res.status(403).send({ message: "Error al ingresar la cantidad" });
            }

            return res.send(orderEntry);
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }
);

router.get("/order_entry/get_all/",
    async (req: Request, res: Response) => {
        try {
            const allData = await appDataSource.getRepository("order_entry").find({ relations: ["provider", "employee.person"], where:{ activo:true} });
            return res.send(allData);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: error });
        }
    }
);

router.get("/order_entry/get_by_id/:id",
    param("id")
        .notEmpty()
        .isNumeric({ no_symbols: true })
        .withMessage("error en el parametro"),
    validateReq,
    async (req: Request, res: Response) => {
        try {
            const Order = await appDataSource.getRepository("order_entry").findOne({ relations: ["orderEntryDetails"], where: { id: req.params["id"] } });
            return res.send(Order);
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }
);

router.put("/order_entry/disable_by_id/:id",
    param("id")
        .notEmpty()
        .isNumeric({ no_symbols: true })
        .withMessage("error en el parametro"),
    validateReq,
    async (req: Request, res: Response) => {
        try {
            const id = req.params["id"];
            const Order = await appDataSource.getRepository("order_entry").findOne({ relations: ["orderEntryDetails"], where: { id: id } });
            if (!Order) return res.status(403).send({ message: "la orden no existe!" });

            if (Order.activo == false) return res.status(403).send({ message: "la orden ya está deshabilitadaaaaa!" });

            const orderEntryDetails = Order["orderEntryDetails"];
            console.log(orderEntryDetails);

            for (let detail of orderEntryDetails) {
                const product = await appDataSource.getRepository("product").findOne({ where: { name: detail.name } });
                if (!product) return res.status(403).send({ message: "el producto no existe!" });
                if (Number(product.cantidad) < Number(detail.quantity)) return res.status(403).send({ message: "el stock del producto no puede ser negativo" });
            }

            for (let detail of orderEntryDetails) {
                const product = await appDataSource.getRepository("product").findOne({ where: { name: detail.name } });
                if (!product) return res.status(403).send({ message: "el producto no existe!" });

                if (Number(product.cantidad) < Number(detail.quantity)) return res.status(403).send({ message: "el stock del producto no puede ser negativo" });
                let nuevo = Number(product.cantidad) - Number(detail.quantity);
                const updateData = await appDataSource.getRepository("product").update(product.id, { cantidad: nuevo });
                if (!updateData) return res.status(403).send({ message: "Error al ingresar la cantidad" });
            }

            const updateActive = await appDataSource.getRepository("order_entry").update(Order.id, { activo: false });
            if (!updateActive) return res.status(403).send({ message: "error al deshabilitar!" });

            return res.send(Order);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
);

export default router;

import { validationToken } from "../middlewares/token";
import { Router, Response, Request } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { And, Between, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not, Or } from "typeorm";
import { ICreateReserve } from "../interfaces/reserve";
import { ICreateReserveDetail } from "../interfaces/reserveDetail";

const router = Router();

router.post("/reserve/register/",
    checkSchema({
        reserveDate: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
        },
        initionDate: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
        },
        expirationDate: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
        },
        asignedEmployee: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "el campo empleado asignado invalido!"
        },
        asignedCustomer: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "el campo cliente asignado invalido!"
        },
        reserveDetails: {
            in: ["body"],
            isArray: true,
            notEmpty: true,
            errorMessage: "el campo detalle de reserva es invalido!"
        },
        activo: {
            in: ["body"],
            notEmpty: true,
            custom: {
                options: (value: boolean) => value === true
            },
            errorMessage: "el campo activo es invalido!"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const asignedEmployee = await appDataSource.getRepository("employee").findOne({ where: { person: { firstName: req.body["asignedEmployee"] } }, relations: ["person"] });
            if (!asignedEmployee) return res.status(403).send({ message: "el empleado no existe!" });

            const asignedCustomer = await appDataSource.getRepository("customer").findOne({ where: { person: { firstName: req.body["asignedCustomer"] } }, relations: ["person"] });
            if (!asignedCustomer) return res.status(403).send({ message: "el cliente no existe!" });

            //TODO VALIDAR QUE FECHA INICIO SEA MENOR QUE FECHA FINAL EN EL CLIENTE
            //TODO AUN FALTA VALIDAR CUANDO F_I Y F_F SOBREPASAN EL RANGO
            const registerIsNotAvailable = await appDataSource.getRepository("reserve").findOne({
                where: [
                    { initionDate: Between(req.body["initionDate"], req.body["expirationDate"]), asignedEmployee: asignedEmployee, activo: true },
                    { expirationDate: Between(req.body["initionDate"], req.body["expirationDate"]), asignedEmployee: asignedEmployee, activo: true },
                    { initionDate: Between(req.body["initionDate"], req.body["expirationDate"]), asignedCustomer: asignedCustomer, activo: true },
                    { expirationDate: Between(req.body["initionDate"], req.body["expirationDate"]), asignedCustomer: asignedCustomer, activo: true },
                    { initionDate: LessThanOrEqual(req.body["expirationDate"]), expirationDate: MoreThanOrEqual(req.body["initionDate"]), asignedEmployee: asignedEmployee, activo: true },
                    { initionDate: LessThanOrEqual(req.body["expirationDate"]), expirationDate: MoreThanOrEqual(req.body["initionDate"]), asignedCustomer: asignedCustomer, activo: true },
                ]
            });

            if (registerIsNotAvailable) return res.status(403).send({ message: "el registro no esta permitido!" });

            const { ...newReserve } = {
                reserveDate: req.body["reserveDate"],
                initionDate: req.body["initionDate"],
                expirationDate: req.body["expirationDate"],
                activo: req.body["activo"],
                asignedCustomer: asignedCustomer,
                asignedEmployee: asignedEmployee
            }
            const newReserveCreated: ICreateReserve = <ICreateReserve>(<unknown>{ ...newReserve });
            const reserve = await appDataSource.getRepository("reserve").save(newReserveCreated);

            const { ...reserveDetail } = { reserve: reserve }

            req.body["reserveDetails"].forEach(async (producto: string) => {
                const item: string[] = producto.split(".");
                const newReserveDetail: ICreateReserveDetail = <ICreateReserveDetail>(<unknown>{ ...reserveDetail });

                switch (item[0]) {
                    case "ms":
                        const microService = await appDataSource.getRepository("micro_service").findOne({ where: { name: item[1] } });
                        newReserveDetail["microServicio"] = microService;
                        await appDataSource.getRepository("reserve_detail").save(newReserveDetail);
                        break;
                    case "s":
                        const service = await appDataSource.getRepository("service").findOne({ where: { description: item[1] } });
                        newReserveDetail["service"] = service;
                        await appDataSource.getRepository("reserve_detail").save(newReserveDetail);
                        break;
                    case "p":
                        const promotion = await appDataSource.getRepository("promotion").findOne({ where: { name: item[1] } });
                        newReserveDetail["promotion"] = promotion;
                        await appDataSource.getRepository("reserve_detail").save(newReserveDetail);
                        break;
                }
            });

            const reserveData = await appDataSource.getRepository("reserve").findOne({ where: { id: reserve.id }, relations: ["asignedEmployee", "asignedCustomer", "reserveDetails", "reserveDetails.promotion", "reserveDetails.service", "reserveDetails.microServicio"] });

            return res.send(reserveData);
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }
);

router.get("/reserve/get_all/",
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const allData = await appDataSource.getRepository("reserve").find({ relations: ["asignedEmployee", "asignedEmployee.person", "asignedCustomer", "asignedCustomer.person", "reserveDetails", "reserveDetails.promotion", "reserveDetails.service", "reserveDetails.microServicio"] });
            return res.send(allData);
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }
);

router.put("/reserve/update_by_id/:id",
    checkSchema({
        initionDate: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
        },
        expirationDate: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "el campo date no puede estar vacio o solo debe ser una fecha"
        },
        asignedEmployee: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "el campo empleado asignado invalido!"
        },
        reserveDetails: {
            in: ["body"],
            isArray: true,
            notEmpty: true,
            errorMessage: "el campo detalle de reserva es invalido!"
        },
        activo: {
            in: ["body"],
            notEmpty: true,
            custom: {
                options: (value: boolean) => value === true || value === false
            },
            errorMessage: "el campo activo es invalido!"
        }
    }),
    param("id")
        .notEmpty()
        .isNumeric({ no_symbols: true })
        .withMessage("error en el parametro"),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const reserveToUpdate = await appDataSource.getRepository("reserve").findOne({ where: { id: req.params["id"] }, relations: ["asignedEmployee", "asignedCustomer", "reserveDetails"] });
            if (!reserveToUpdate) return res.status(403).send({ message: "la reserva solicitada no existe!" });

            const asignedEmployee = await appDataSource.getRepository("employee").findOne({ where: { person: { firstName: req.body["asignedEmployee"] } }, relations: ["person"] });
            if (!asignedEmployee) return res.status(403).send({ message: "el empleado no existe!" });

            const asignedCustomer = await appDataSource.getRepository("customer").findOne({ where: { person: { firstName: req.body["asignedCustomer"] } }, relations: ["person"] });
            if (!asignedCustomer) return res.status(403).send({ message: "el cliente no existe!" });

            if (reserveToUpdate["initionDate"] !== req.body["initionDate"] || reserveToUpdate["expirationDate"] !== req.body["expirationDate"]) {
                const registerIsNotAvailable = await appDataSource.getRepository("reserve").findOne({
                    where: [
                        { initionDate: Between(req.body["initionDate"], req.body["expirationDate"]), asignedEmployee: asignedEmployee, activo: true, id: Not(req.params["id"]) },
                        { expirationDate: Between(req.body["initionDate"], req.body["expirationDate"]), asignedEmployee: asignedEmployee, activo: true, id: Not(req.params["id"]) },
                        { initionDate: Between(req.body["initionDate"], req.body["expirationDate"]), asignedCustomer: asignedCustomer, activo: true, id: Not(req.params["id"]) },
                        { expirationDate: Between(req.body["initionDate"], req.body["expirationDate"]), asignedCustomer: asignedCustomer, activo: true, id: Not(req.params["id"]) },
                    ]
                });

                if (registerIsNotAvailable) return res.status(403).send({ message: "las nuevas fechas no se pueden registrar!" });
            }

            await appDataSource.getRepository("reserve").update({ id: reserveToUpdate["id"] }, {
                asignedCustomer: asignedCustomer,
                asignedEmployee: asignedEmployee,
                activo: req.body["activo"],
                initionDate: req.body["initionDate"],
                expirationDate: req.body["expirationDate"]
            });

            const { ...reserveDetail } = { reserve: reserveToUpdate };

            req.body["reserveDetails"].forEach(async (producto: string) => {
                const item: string[] = producto.split(".");
                const newReserveDetail: ICreateReserveDetail = <ICreateReserveDetail>(<unknown>{ ...reserveDetail });

                switch (item[0]) {
                    case "ms":
                        const microService = await appDataSource.getRepository("micro_service").findOne({ where: { name: item[1] } });
                        if (!microService) return res.status(403).send({ message: "error al actualizar la reserva!" });
                        newReserveDetail["microServicio"] = microService;
                        await appDataSource.getRepository("reserve_detail").save(newReserveDetail);

                        break;
                    case "s":
                        const service = await appDataSource.getRepository("service").findOne({ where: { description: item[1] } });
                        if (!service) return res.status(403).send({ message: "error al actualizar la reserva!" });
                        newReserveDetail["service"] = service;
                        await appDataSource.getRepository("reserve_detail").save(newReserveDetail);

                        break;
                    case "p":
                        const promotion = await appDataSource.getRepository("promotion").findOne({ where: { name: item[1] } });
                        if (!promotion) return res.status(403).send({ message: "error al actualizar la reserva!" });
                        newReserveDetail["promotion"] = promotion;
                        await appDataSource.getRepository("reserve_detail").save(newReserveDetail);

                        break;
                }
            });

            reserveToUpdate["reserveDetails"].forEach(async (detail: any) => await appDataSource.getRepository("reserve_detail").delete(detail["id"]));

            return res.send({ message: "la reserva se ha actualizado correctamente!" });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
);

router.delete("/reserve/delete/:id",
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("Error en el campo id!"),
    validationToken,
    async (req: Request, res: Response) => {
        try {
            await appDataSource.getRepository("reserve_detail").delete({ reserve: req.params["id"] });
            const result = await appDataSource.getRepository("reserve").delete({ id: req.params["id"], activo: true });
            return res.send(result);
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: "error interno en el servidor!" });
        }
    }
);

export default router;  
import { Request, Response, Router } from "express";
import { appDataSource } from "../dataBase";
import { validationToken } from "../middlewares/token";

const router = Router();

router.get("/person/get_all_dni/", 
    validationToken,
    async (_: Request, res: Response) => {
        try {
            const allDni = await appDataSource.getRepository("person").find({ select: ["dni"] });
            const allEmployess = await appDataSource.getRepository("employee").find({ relations: ["person"] });
            const allCustomer = await appDataSource.getRepository("customer").find({ relations: ["person"] }); 
            
            allDni.forEach((object: any, index: number) => {
                const { dni } = object;

                allEmployess.forEach((employee: any) => (employee.person["dni"] === dni) ? allDni.splice(index, 1) : null);
                allCustomer.forEach((customer: any) => (customer.person["dni"] === dni) ? allDni.splice(index, 1) : null);
            });

            return res.send(allDni);
        } catch (error) {
            return res.status(500).send({ message: "error interno en el servidor" });
        }
    }
);

export default router;
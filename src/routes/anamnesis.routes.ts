import { Router, Request, Response } from "express";
import { check, checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import * as dotenv from "dotenv";
import { ICreateAnamnesis, IUpdateAnamnesis } from "../interfaces/anamnesis";
import { validationToken } from "../middlewares/token";

const router = Router();
dotenv.config();

router.get("/anamnesis/get_all/",
    validationToken,
    async (_: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("anamnesis").find({
                relations: ["customer.person"]
            });
            return res.send(data);
        } catch (error) {
            return res.status(500).send({ message: "error interno en el servidor" });
        }
    }
);

router.get("/anamnesis/get_by_dni/:id",
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("el parametro dni es erroneo"),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        const dni = req.params["id"];

        const data = await appDataSource.getRepository("anamnesis").createQueryBuilder("anamnesis")
            .leftJoinAndSelect("anamnesis.customer", "customer")
            .leftJoinAndSelect("customer.person", "person")
            .where("person.dni = :dni", { dni })
            .getOne();
        if (!data) return res.status(403).send({ message: "el anamnesis no existe!" });
        return res.send(data);
    }
);

router.post("/anamnesis/register/:id", param("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro dni es erroneo"),
    validateReq,
    validationToken,
    checkSchema({
        birthDate: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo nacimiento no puede estar vacio"
        },
        address: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo direccion ha tenido un error"
        },
        city: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo ciudad ha tenido un error"
        },
        email: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "datos del email erroneos"
        },
        other: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "datos erroneos"
        },
        provenencia: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo provenencia no puede estar vacio"
        },
        queloide: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo queloide ha tenido un error"
        },
        lentesDeContacto: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo lentesDeContacto ha tenido un error"
        },
        aspirinas: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo aspirinas ha tenido un error"
        },
        depresion: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo depresion ha tenido un error"
        },
        enfermedadesCardiovasculares: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo enfermedadesCardiovasculares ha tenido un error"
        },
        epilepsia: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo epilepsia ha tenido un error"
        },
        hipertension: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo hipertension ha tenido un error"
        },
        problemasIntestinales: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo problemasIntestinales ha tenido un error"
        },
        problemasRenales: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo problemasRenales ha tenido un error"
        },
        problemasRespiratorios: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo problemasRespiratorios ha tenido un error"
        },
        problemasCirculatorios: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo problemasCirculatorios ha tenido un error"
        },
        alergias: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo alergias ha tenido un error"
        },
        tatuajes: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo tatuajes ha tenido un error"
        },
        hemofilia: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo hemofilia ha tenido un error"
        },
        cancer: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo cancer ha tenido un error"
        },
        vihPlus: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo vihPlus ha tenido un error"
        },
        marcaPasos: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo marcaPasos ha tenido un error"
        },
        diabetes: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo diabetes ha tenido un error"
        },
        glaucoma: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo glaucoma ha tenido un error"
        },
        embarazada: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo embarazada ha tenido un error"
        },
        hepatitis: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo hepatitis ha tenido un error"
        },
        anemia: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo anemia ha tenido un error"
        },
        radioUno: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioUno ha tenido un error"
        },
        respuestaUno: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaUno ha tenido un error"
        },
        radioDos: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioDos ha tenido un error"
        },
        respuestaDos: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaDos ha tenido un error"
        },
        radioTres: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioTres ha tenido un error"
        },
        respuestaTres: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaTres ha tenido un error"
        },
        radioCuatro: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioCuatro ha tenido un error"
        },
        respuestaCuatro: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaCuatro ha tenido un error"
        },
        radioCinco: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioCinco ha tenido un error"
        },
        respuestaCinco: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaCinco ha tenido un error"
        },
        respuestaSeis: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaSeis ha tenido un error"
        },
        observacion: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo observacion ha tenido un error"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const dni = req.params["id"];

            const busqueda = await appDataSource.getRepository("anamnesis").createQueryBuilder("anamnesis")
                .leftJoinAndSelect("anamnesis.customer", "customer")
                .leftJoinAndSelect("customer.person", "person")
                .where("person.dni = :dni", { dni })
                .getOne();
            if (busqueda) return res.status(403).send({ message: "el anamnesis ya existe!" });

            // Obtener la persona asignada
            const asignedPerson = await appDataSource.getRepository("person").findOne({ where: { dni } });
            if (!asignedPerson) {
                return res.status(404).send({ message: "Persona no encontrada" });
            }

            // Obtener el cliente asignado
            const asignedCustomer = await appDataSource.getRepository("customer").findOne({ where: { person: asignedPerson } });
            if (!asignedCustomer) {
                return res.status(404).send({ message: "Cliente no encontrado" });
            }

            // Combinar los datos de req.body con el cliente asignado
            const anamnesis = {
                ...req.body,
                customer: asignedCustomer,
            };
            console.log(anamnesis);
            const newAnamnesis: ICreateAnamnesis = <ICreateAnamnesis>(<unknown>{ ...anamnesis });

            // Guardar el nuevo anamnesis en la base de datos
            const data = await appDataSource.getRepository("anamnesis").save(newAnamnesis);

            return res.send(data);

        } catch (error) {
            return res.status(500).send({ message: "ha ocurrido un error interno" });
        }
    }
);

router.put("/anamnesis/update_by_dni/:id", param("id")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("el parametro dni es erroneo"),
    validateReq,
    validationToken,
    checkSchema({
        birthDate: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo nacimiento no puede estar vacio"
        },
        address: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo direccion ha tenido un error"
        },
        city: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo ciudad ha tenido un error"
        },
        email: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "datos del email erroneos"
        },
        other: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "datos erroneos"
        },
        provenencia: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo provenencia no puede estar vacio"
        },
        queloide: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo queloide ha tenido un error"
        },
        lentesDeContacto: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo lentesDeContacto ha tenido un error"
        },
        aspirinas: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo aspirinas ha tenido un error"
        },
        depresion: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo depresion ha tenido un error"
        },
        enfermedadesCardiovasculares: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo enfermedadesCardiovasculares ha tenido un error"
        },
        epilepsia: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo epilepsia ha tenido un error"
        },
        hipertension: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo hipertension ha tenido un error"
        },
        problemasIntestinales: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo problemasIntestinales ha tenido un error"
        },
        problemasRenales: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo problemasRenales ha tenido un error"
        },
        problemasRespiratorios: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo problemasRespiratorios ha tenido un error"
        },
        problemasCirculatorios: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo problemasCirculatorios ha tenido un error"
        },
        alergias: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo alergias ha tenido un error"
        },
        tatuajes: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo tatuajes ha tenido un error"
        },
        hemofilia: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo hemofilia ha tenido un error"
        },
        cancer: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo cancer ha tenido un error"
        },
        vihPlus: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo vihPlus ha tenido un error"
        },
        marcaPasos: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo marcaPasos ha tenido un error"
        },
        diabetes: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo diabetes ha tenido un error"
        },
        glaucoma: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo glaucoma ha tenido un error"
        },
        embarazada: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo embarazada ha tenido un error"
        },
        hepatitis: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo hepatitis ha tenido un error"
        },
        anemia: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo anemia ha tenido un error"
        },
        radioUno: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioUno ha tenido un error"
        },
        respuestaUno: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaUno ha tenido un error"
        },
        radioDos: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioDos ha tenido un error"
        },
        respuestaDos: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaDos ha tenido un error"
        },
        radioTres: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioTres ha tenido un error"
        },
        respuestaTres: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaTres ha tenido un error"
        },
        radioCuatro: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioCuatro ha tenido un error"
        },
        respuestaCuatro: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaCuatro ha tenido un error"
        },
        radioCinco: {
            in: ["body"],
            isBoolean: true,
            optional: true,
            errorMessage: "el campo radioCinco ha tenido un error"
        },
        respuestaCinco: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaCinco ha tenido un error"
        },
        respuestaSeis: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo respuestaSeis ha tenido un error"
        },
        observacion: {
            in: ["body"],
            isString: true,
            optional: true,
            errorMessage: "el campo observacion ha tenido un error"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        const dni = req.params["id"];
        console.log(req.body);

        const busqueda = await appDataSource.getRepository("anamnesis").createQueryBuilder("anamnesis")
            .leftJoinAndSelect("anamnesis.customer", "customer")
            .leftJoinAndSelect("customer.person", "person")
            .where("person.dni = :dni", { dni })
            .getOne();
        if (!busqueda) return res.status(403).send({ message: "el anamnesis no existe prro!" });

        // Desestructuración del id y el objeto customer de anamnesis, osea se petatean
        const { id, customer, ...anamnesis } = req.body;
        const updateAnamnesis: IUpdateAnamnesis = <IUpdateAnamnesis>(<unknown>{ ...anamnesis });
        const updateData = await appDataSource.getRepository("anamnesis").update(busqueda.id, updateAnamnesis);

        return res.send({
            message: "se ha actualizado con exito el Anamnesis!",
            data: updateData
        });
    }
);

export default router;

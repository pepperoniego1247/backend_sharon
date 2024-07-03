import { validationToken } from "../middlewares/token";
import { Router, Request, Response } from "express";
import * as dotenv from "dotenv";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { User } from "../entities/user";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { IUserUpdate, UserProfileUpdate } from "../interfaces/user";
import { IUser } from "../interfaces/user";
import { ActiveSession } from "../entities/activeSession";

const router = Router();
dotenv.config();

router.post("/user/login/",
    checkSchema({
        userName: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "username invalido, evita los espacios vacios o caracteres incorrectos."
        },
        password: {
            in: ["body"],
            isLength: {
                options: { max: 30, min: 8 },
                errorMessage: "max: 30 | min: 8 caracteres validos, contraseña incorrecta!"
            },
            isString: { errorMessage: "la constraseña solo debe contener letras y numeros" }
        },
        device: {
            in: ["body"],
            isString: true,
            notEmpty: { errorMessage: "el dispositivo no puede tener campos vacios!" }
        }
    }),
    validateReq,
    async (req: Request, res: Response) => {
        try {
            const userToAuth = await appDataSource.getRepository("user").findOne({ where: { userName: req.body["userName"] }, relations: ["employee", "employee.role"] });
            if (!userToAuth) return res.status(403).send("el username no existe!");
            if (!await bcrypt.compare(req.body["password"], userToAuth["password"])) return res.status(401).send("contraseña erronea!");

            const accessToken = await jwt.sign({
                userName: userToAuth["userName"],
                id: userToAuth["id"]
            }, process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: "1hr",
                // algorithm: "HS256"
            });

            const verifySession = await appDataSource.getRepository(ActiveSession).findOne({ where: { user: userToAuth } });
            if (verifySession) return res.status(403).json({ message: "el usuario ya esta logueado!" });

            const decodedToken: jwt.JwtPayload = jwt.decode(accessToken, { json: true })!;
            const creationDate: Date = new Date(decodedToken.iat! * 1000);
            const expirationDate: Date = new Date(decodedToken.exp! * 1000);
            const activeSession: any = {
                user: userToAuth,
                device: req.body["device"],
                creationDate: creationDate,
                expirationDate: expirationDate,
                jwt: accessToken
            }

            await appDataSource.getRepository(ActiveSession).save(activeSession);

            return res.send({
                message: "logeo existoso!",
                jwt: accessToken,
                type: userToAuth.employee.role.name,
                id: userToAuth.id,
                expirationDate: expirationDate
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "Error en el servidor!" });
        }
    });

router.post("/user/register/",
    
    checkSchema({
        userName: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "username invalido!!",
        },
        password: {
            in: ["body"],
            isLength: {
                options: { max: 30, min: 5 },
                errorMessage: "max: 30 | min: 5 caracteres! contraseña invalida"
            },
            isAlphanumeric: { errorMessage: "la contraseña debe contener solo letras y numeros!" }
        },
        dni: {
            in: ["body"],
            isNumeric: { errorMessage: "el dni debe ser numerico" },
            notEmpty: true,
            errorMessage: "el campo dni no puede estar vacio"
        },
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const userAlreadyExists = await appDataSource.getRepository("user").findOne({ where: { userName: req.body["userName"] } });
            if (userAlreadyExists) return res.status(403).json({ message: "el usuario ya existe!" });

            const findPerson = await appDataSource.getRepository("person").findOne({ where: { dni: req.body["dni"] } });
            if (!findPerson) return res.status(403).send({ message: "la persona no existe en el sistema!" });

            const findEmployee = await appDataSource.getRepository("employee").findOne({ where: { person: findPerson } });
            if (!findEmployee) return res.status(403).send({ message: "el empleado no existe!" });

            const { ...user } = req.body;
            const newUser: IUser = <IUser>(<unknown>{ ...user })

            newUser["employee"] = findEmployee;
            newUser["password"] = await bcrypt.hash(newUser["password"], 8);
            const data = await appDataSource.getRepository("user").save(newUser);
            const { userName, employee } = data;

            return res.send({
                userName: userName,
                employee: employee
            });
        } catch (error) { return res.status(500).json({ message: error }); }
    });


router.get("/user/get_all/",
    validationToken,
    async (_: Request, res: Response) => {
        try {
            const allUsers = await appDataSource.getRepository("user").find({ relations: ["employee", "employee.person", "employee.role"], select: ["id", "userName", "password"] });
            if (!allUsers) return res.status(403).send({ message: "error al encontrar los usuarios!" })

            allUsers.forEach((user) => {
                const { password } = user;
                user["password"] = password.slice(0, 20);
            });

            return res.send(allUsers);
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    }
)

router.get("/user/get_by_userName/:userName",
    param("userName")
        .isString()
        .withMessage("el id debe ser entero!"),
    validateReq,
    // validationToken,
    async (req: Request, res: Response) => {
        try {
            const userById = await appDataSource.getRepository("user").findOne({ where: { userName: req.params["userName"] } });
            if (!userById) return res.status(403).send({ message: "el usuario no existe!", status: false });

            return res.send({
                message: "usuario encontrado!",
                userId: userById.id
            });
        } catch (error) {
            return res.status(500).send({
                message: "error en el servidor!",
                error: error
            });
        }
    }
);

router.get("/user/get_by_id/:id",
    param("id")
        .isNumeric()
        .withMessage("el id debe ser entero!"),
    validateReq,
    // validationToken,
    async (req: Request, res: Response) => {
        try {
            const userById = await appDataSource.getRepository("user").findOne({ where: { id: req.params["id"] }, relations: ["employee", "employee.person", "employee.role"] });
            if (!userById) return res.status(403).send({ message: "el usuario no existe!", status: false });

            return res.send({
                message: "usuario encontrado!",
                userId: userById
            });
        } catch (error) {
            return res.status(500).send({
                message: "error en el servidor!",
                error: error
            });
        }
    }
);

router.put("/user/edit_profile_by_id/:id", 
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("error en el campo id"),
    checkSchema({
        phoneNumber: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "error en el campo phonenumber"
        },
        avatar: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "error en el campo avatar"
        }
    }),
    validateReq,
    validationToken,
    async (req: Request, res: Response) => {
        try {
            const user = await appDataSource.getRepository("user").findOne({ where: { id: req["params"]["id"] } });
            if (!user) return res.status(403).send({ message: "el usuario no existe!" });

            const { ...updateUser } = req.body;
            const updatedUser: UserProfileUpdate = <UserProfileUpdate>(<unknown> { ...updateUser });
            console.log(updatedUser)
            await appDataSource.getRepository("user").update({ id: req.params["id"] }, { avatar: updatedUser["avatar"] });
            // await appDataSource.getRepository("user").update({ id: req.params["id"] }, { employee: { person: { phoneNumber: updatedUser["phoneNumber"] } } });
            return res.send({ message: "se ha actualizado correctamente!" });
        } catch (error) {
            console.log(error);
        }
    }
);

router.put("/user/edit_by_id/:id",
    checkSchema({
        userName: {
            in: ["body"],
            isString: true,
            notEmpty: true,
            errorMessage: "userName invalido!!",
        },
        password: {
            in: ["body"],
            optional: true,
            isLength: {
                options: { max: 30, min: 5 },
                errorMessage: "max: 30 | min: 5 caracteres validos, contraseña incorrecta!"
            },
            isAlphanumeric: { errorMessage: "la contraseña solo debe contener letras y numeros" }
        }
    }),
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("el id debe ser numerico!"),
    // validationToken,
    async (req: Request, res: Response) => {
        try {
            const userToEdit = await appDataSource.getRepository("user").findOne({ where: { id: req.params["id"] } });
            if (!userToEdit) return res.status(403).send({ message: "el usuario no existe!" });

            const { ...userData } = req.body;
            const userToUpdate: IUserUpdate = <IUserUpdate>(<unknown>{ ...userData })
            userToUpdate["password"] = await bcrypt.hash(req.body["password"], 8);
            const { userName, password } = userToUpdate;
            await appDataSource.getRepository("user").update({ id: userToEdit["id"] }, { userName: userName, password: password });
            
            return res.send({
                message: "el usuario se ha actualizado!"
            });
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor!" });
        }
    }
);

router.delete("/user/log_out/:id", 
    param("id")
        .notEmpty()
        .isNumeric({ no_symbols: true })
        .withMessage("error en el campo id"),
    async (req: Request, res: Response) => {
        try {
            await appDataSource.getRepository(ActiveSession).delete({ user: { id: Number(req.params["id"]) } });
            return res.send({ message: "el usuario ha cerrado sesion correctamente!" });
        } catch (error) {
            return res.status(500).send({ message: "error interno en el servidor!" });
        }
    }
)

export default router;
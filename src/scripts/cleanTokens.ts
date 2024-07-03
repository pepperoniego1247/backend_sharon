import { LessThan } from "typeorm";
import { appDataSource } from "../dataBase"
import { ActiveSession } from "../entities/activeSession";

export const cleanTokens = async () => {
    try {
        await appDataSource.getRepository(ActiveSession).delete({ expirationDate: LessThan(new Date()) });
    } catch (error) {}
}
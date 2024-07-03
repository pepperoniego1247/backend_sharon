import { Person } from "../entities/person";
import { Role } from "../entities/role";

export interface ICreateEmployee {
    role: Role;
    person: Person;
}
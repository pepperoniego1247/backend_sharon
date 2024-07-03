import { Person } from "../entities/person";

export interface ICreateCustomer {
    person: Person;
    notation: string;
}

import { Customer } from "../entities/customer";
import { Employee } from "../entities/employee";

export interface ICreateReserve {
    reserveDate: string,
    initionDate: string,
    expirationDate: string,
    activo: boolean,
    asignedEmployeeId: any,
    asignedCustomerId: any
}
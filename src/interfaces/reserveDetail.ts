import { MicroService } from "../entities/microService";
import { Promotion } from "../entities/promotion";
import { Reserve } from "../entities/reserve";
import { Service } from "../entities/service";

export interface ICreateReserveDetail {
    reserve: Reserve
    promotion: any,
    service: any,
    microServicio: any
}
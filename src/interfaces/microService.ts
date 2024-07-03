import { Service } from "../entities/service";

export interface ICreateMicroService {
    name: string;
    activo: boolean;
    price: number;
}

export interface UpdateMicroService { 
    name: string;
    price: number;
    activo: boolean;
    service: Service | null;
}
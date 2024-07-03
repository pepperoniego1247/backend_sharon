import { Employee } from "../entities/employee";

export interface currentUser {
    userName: string;
    password: string;
}

export interface IUser {
    userName: string;
    password: string;
    employee: any;
}

export interface IUserUpdate {
    userName: string;
    password: string;
}

export interface UserProfileUpdate {
    phoneNumber: string;
    avatar: string;
}

export interface ICreateUser {
    userName: string;
    password: string;
}

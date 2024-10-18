import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Employee } from "./employee";
import { Payment_Detail } from "./payment_detail";

@Entity()
export class Payment extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @OneToMany(() => Payment_Detail, (payment_Detail) => payment_Detail.payment)
    paymentDetails: Payment_Detail[];

    @ManyToOne(() => Employee, (employee) => employee.payments)
    employee: Employee;

    @Column()
    date: Date;

    @Column()
    total: number;

    @Column()
    activo: boolean;
}
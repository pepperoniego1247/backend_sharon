import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee";

@Entity()
export class Payment extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Employee, (employee) => employee.payments)
    employee: Employee;

    @Column()
    extra: number;

    @Column()
    date: Date;

    @Column()
    totalAmount: number;
}
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Employee } from "./employee";
import { Payment } from "./payment";


@Entity()
export class Payment_Detail extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Payment, (payment) => payment.paymentDetails)
    payment: Payment;

    @Column()
    employeeId: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    extra: number;

    @Column()
    totalAmount: number;
}
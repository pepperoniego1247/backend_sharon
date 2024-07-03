import { BaseEntity, OneToOne, JoinColumn, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee";
import { SaleDetail } from "./saleDetail";
import { Reserve } from "./reserve";

@Entity()
export class Sale extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    date: Date;

    @Column()
    paymentMethod: string;

    @OneToOne(() => Reserve)
    @JoinColumn()
    reserva: Reserve;

    @Column()
    totalAmount: number;

    @Column({ nullable: true })
    sunatDocumentId: string;

    @Column({ nullable: true })
    fileNameDocumentSunat: string

    @ManyToOne(() => Employee, (employee) => employee.sales)
    asignedEmployee: Employee;

    @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale)
    saleDetails: SaleDetail[]
}
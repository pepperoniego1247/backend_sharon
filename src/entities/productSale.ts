import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee";
import { ProductSaleDetail } from "./productSaleDetail";

@Entity()
export class ProductSale extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    date: Date;
    
    @Column()
    paymentMethod: string;

    @Column()
    totalAmount: number;

    @Column({ nullable: true })
    sunatDocumentId: string;

    @Column({ nullable: true })
    fileNameDocumentSunat: string

    @ManyToOne(() => Employee, (employee) => employee.productSales)
    employee: Employee;

    @OneToMany(() => ProductSaleDetail, (productSaleDetail) => productSaleDetail.productSale)
    productSaleDetails: ProductSaleDetail[];
}
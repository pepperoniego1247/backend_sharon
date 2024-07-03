import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Role } from "./role";
import { Person } from "./person";
import { Reserve } from "./reserve";
import { Sale } from "./sale";
import { OrderEntry } from "./orderEntry";
import { Payment } from "./payment";
import { ProductSale } from "./productSale";

@Entity()
@Unique(["person"]) 
export class Employee extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Role, (Role) => Role)
    role: Role;

    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;

    @OneToMany(() => Reserve, (reserve) => reserve.asignedEmployee)
    reserves: Reserve[];

    @OneToMany(() => Sale, (sale) => sale.asignedEmployee)
    sales: Sale[];

    @OneToMany(() => OrderEntry, (orderEntry) => orderEntry.employee)
    orderEntrys: OrderEntry[];

    @OneToMany(() => Payment, (payment) => payment.employee)
    payments: Payment[];

    @OneToMany(() => ProductSale, (productSale) => productSale.employee)
    productSales: ProductSale[];
}
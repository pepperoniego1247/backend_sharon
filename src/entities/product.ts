import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntryDetail } from "./orderEntryDetail";
import { ProductSaleDetail } from "./productSaleDetail";

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;
    
    @Column()
    category: string;

    @Column()
    price: number;

    @Column()
    cantidad: number;

    @Column()
    activo: boolean;

    @Column()
    comerciable: boolean;

    @Column({ length: "MAX", nullable: true })
    image: string;

    @Column({ nullable: true, length: 500 })
    description: string;

    @OneToMany(() => ProductSaleDetail, (productSaleDetail) => productSaleDetail.producto)
    productSaleDetails: ProductSaleDetail[];

    @OneToMany(() => OrderEntryDetail, (orderEntryDetail) => orderEntryDetail.product)
    orderEntryDetails: OrderEntryDetail[];
}
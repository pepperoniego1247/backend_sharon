import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductSale } from "./productSale";
import { Product } from "./product";

@Entity()
export class ProductSaleDetail extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @Column()
    subTotal: number;

    @ManyToOne(() => Product, (product) => product.productSaleDetails)
    producto: Product;

    @ManyToOne(() => ProductSale, (productSale) => productSale.productSaleDetails)
    productSale: ProductSale;
}
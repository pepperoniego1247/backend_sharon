import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./provider";
import { OrderEntry } from "./orderEntry";
import { Product } from "./product";

@Entity()
export class OrderEntryDetail extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;
    
    @Column()
    quantity: number;

    @ManyToOne(() => OrderEntry, (orderEntry) => orderEntry.orderEntryDetails)
    orderEntry: OrderEntry;

    @ManyToOne(() => Product, (product) => product.orderEntryDetails)
    product: Product;
}
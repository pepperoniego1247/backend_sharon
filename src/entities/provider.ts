import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./person";
import { OrderEntry } from "./orderEntry";

@Entity()
export class Provider extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({nullable: true})
    ruc: string;

    @Column({nullable: true})
    address: string;

    @Column()
    name: string;

    @Column({nullable: true})
    phoneNumber: string;

    @Column({nullable: true})
    activo: boolean;

    @OneToOne(() => Person)
    person: Person;

    @OneToMany(() => OrderEntry, (orderEntry) => orderEntry.provider)
    orderEntrys: OrderEntry[];
}

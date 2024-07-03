import { BaseEntity, OneToOne, JoinColumn, PrimaryGeneratedColumn, Column, Entity, OneToMany, Unique } from "typeorm";
import { Person } from "./person";
import { Reserve } from "./reserve";

@Entity()
@Unique(["person"])
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ nullable: true, length: "1000" })
    notation: string;

    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;

    @OneToMany(() => Reserve, (reserve) => reserve.asignedCustomer)
    reserves: Reserve[]
}
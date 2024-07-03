import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Employee } from "./employee";

@Entity()
@Unique(["name"])
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ length: 70 })
    name: string;

    @Column()
    payment: number;

    @OneToMany(() => Employee, (employee) => employee.role)
    employees: Employee[];
}
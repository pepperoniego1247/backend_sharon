import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ length: 150 })
    userName: string;

    @Column({ length: 60 })
    password: string;

    @Column({ type: "nvarchar", length: "MAX", nullable: true })
    avatar: string;

    @OneToOne(() => Employee)
    @JoinColumn()
    employee: Employee;
}
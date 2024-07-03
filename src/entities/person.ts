import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Person extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ length: 150 })
    firstName: string;
    
    @Column()
    lastName: string;
    
    @Column()
    dni: string;
    
    @Column()
    phoneNumber: string;

    @Column()
    activo: boolean;
}
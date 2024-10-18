import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Anamnesis } from "./anamnesis";
import { ProcessPigment } from "./pigment_process";

@Entity()
export class Pigment extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    nombre: string;

    @Column()
    activo: boolean;

    @OneToMany(() => ProcessPigment, (processPigment) => processPigment.pigmento)
    pigmentoProcesos: ProcessPigment[];

}

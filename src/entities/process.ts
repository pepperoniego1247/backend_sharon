import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Anamnesis } from "./anamnesis";
import { ProcessPigment } from "./pigment_process";

@Entity()
export class Process extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    procedimiento: string;

    @Column()
    fecha: Date;

    @ManyToOne(() => Anamnesis, (anamnesis) => anamnesis.procedimientos)
    anamnesis: Anamnesis;

    @OneToMany(() => ProcessPigment, (processPigment) => processPigment.proceso)
    pigmentoProcesos: ProcessPigment[];
}

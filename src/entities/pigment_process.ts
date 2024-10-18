import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Process } from "./process";
import { Pigment } from "./pigment";

@Entity()
export class ProcessPigment extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ nullable: true})
    nombre: string;

    @ManyToOne(() => Process, (process) => process.pigmentoProcesos)
    proceso: Process;

    @ManyToOne(() => Pigment, (pigment) => pigment.pigmentoProcesos)
    pigmento: Pigment;
}   
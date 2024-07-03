import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Process } from "./process";

@Entity()
export class ProcessPigment extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToOne(() => Process, (process) => process.pigmentoProcesos)
    proceso: Process;
}   
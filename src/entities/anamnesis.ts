import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer";
import { Process } from "./process";

@Entity()
export class Anamnesis extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @OneToOne(() => Customer)
    @JoinColumn()
    customer: Customer;

    @Column({nullable: true})
    birthDate: Date;

    @Column({nullable: true})
    address: string;

    @Column({nullable: true})
    city: string;

    @Column({nullable: true})
    email: string;

    @Column({nullable: true})
    other: string;

    @Column()
    provenencia: string;

    @Column()
    queloide: boolean;
    
    @Column()
    lentesDeContacto: boolean;

    @Column()
    aspirinas: boolean;

    @Column()
    depresion: boolean;

    @Column()
    enfermedadesCardiovasculares: boolean;

    @Column()
    epilepsia: boolean;

    @Column()
    hipertension: boolean;

    @Column()
    problemasIntestinales: boolean;

    @Column()
    problemasRenales: boolean;

    @Column()
    problemasRespiratorios: boolean;

    @Column()
    problemasCirculatorios: boolean;

    @Column()
    alergias: boolean;

    @Column()
    tatuajes: boolean;

    @Column()
    hemofilia: boolean;

    @Column()
    cancer: boolean;

    @Column()
    vihPlus: boolean;

    @Column()
    marcaPasos: boolean;

    @Column()
    diabetes: boolean;

    @Column()
    glaucoma: boolean;

    @Column()
    embarazada: boolean;

    @Column()
    hepatitis: boolean;

    @Column()
    anemia: boolean;

    @Column({nullable: true})
    radioUno: boolean;
    
    @Column()
    respuestaUno: string;

    @Column({nullable: true})
    radioDos: boolean;
    
    @Column()
    respuestaDos: string;

    @Column({nullable: true})
    radioTres: boolean;
    
    @Column()
    respuestaTres: string;

    @Column({nullable: true})
    radioCuatro: boolean;
    
    @Column()
    respuestaCuatro: string;

    @Column({nullable: true})
    radioCinco: boolean;
    
    @Column()
    respuestaCinco: string;

    @Column()
    respuestaSeis: string;

    @Column({nullable: true})
    observacion: string;

    @OneToMany(() => Process, (process) => process.anamnesis)
    procedimientos: Process[];
}

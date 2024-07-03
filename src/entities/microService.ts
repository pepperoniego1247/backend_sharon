import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { ReserveDetail } from "./reserveDetail";
import { Service } from "./service";

@Entity()
export class MicroService extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @OneToMany(() => ReserveDetail, (reserveDetail) => reserveDetail.microServicio)
    reserveDetail: ReserveDetail[];

    @ManyToOne(() => Service, (service) => service.microServices)
    service: Service;

    @Column()
    activo: boolean;
}

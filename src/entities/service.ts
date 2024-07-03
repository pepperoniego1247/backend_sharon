import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reserve } from "./reserve";
import { ReserveDetail } from "./reserveDetail";
import { MicroService } from "./microService";
import { Promotion } from "./promotion";
import { PromotionDetail } from "./promotionDetail";

@Entity()
export class Service extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    description: string;

    @Column()
    price: number;

    @OneToMany(() => ReserveDetail, (reserveDetail) => reserveDetail.service)
    reserveDetails: ReserveDetail[];

    @OneToMany(() => MicroService, (microService) => microService.service)
    microServices: MicroService[];

    @OneToMany(() => PromotionDetail, (promotionDetail) => promotionDetail.service)
    promotionDetails: PromotionDetail[];
}
import { BaseEntity, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./service";
import { MicroService } from "./microService";
import { Promotion } from "./promotion";
import { Reserve } from "./reserve";

@Entity()
export class ReserveDetail extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Reserve, (reserve) => reserve.reserveDetails)
    reserve: Reserve;

    @ManyToOne(() => Promotion, (promotion) => promotion.reserveDetails)
    promotion: Promotion;

    @ManyToOne(() => Service, (service) => service.reserveDetails)
    service: Service;

    @ManyToOne(() => MicroService, (microService) => microService.reserveDetail)
    microServicio: MicroService;
}
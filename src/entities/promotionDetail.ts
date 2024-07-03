import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./service";
import { Promotion } from "./promotion";

@Entity()
export class PromotionDetail extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Service, (service) => service.promotionDetails)
    service: Service;

    @ManyToOne(() => Promotion, (promotion) => promotion.promotionDetails)
    promotion: Promotion;
}

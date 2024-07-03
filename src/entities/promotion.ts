import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./service";
import { ReserveDetail } from "./reserveDetail";
import { PromotionDetail } from "./promotionDetail";

@Entity()
export class Promotion extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ length: 150 })
    name: string;

    @Column()
    precio: number;
    
    @OneToMany(() => ReserveDetail, (reserveDetail) => reserveDetail.promotion)
    reserveDetails: ReserveDetail[]
    
    @OneToMany(() => PromotionDetail, (promotionDetail) => promotionDetail.promotion)
    promotionDetails: PromotionDetail[];
   
    @Column()
    activo: boolean;
}
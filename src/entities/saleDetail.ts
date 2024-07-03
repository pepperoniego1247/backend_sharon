import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./sale";
import { ReserveDetail } from "./reserveDetail";

@Entity()
export class SaleDetail extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    //! RAZON PARA NAME?!
    @Column()
    name: string;

    //! PENSAR BIEN LO DE LOS DATOS DE DETALLE VENTA
    //! POR QUE DE POR SI RESERVEDETAIL YA TIENE LA INFORMACION
    @Column()
    subTotal: number;

    @ManyToOne(() => Sale, (sale) => sale.saleDetails)
    sale: Sale;

    @OneToOne(() => ReserveDetail)
    @JoinColumn()
    reserveDetail: ReserveDetail;
}
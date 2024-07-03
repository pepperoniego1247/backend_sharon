import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class ActiveSession extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ length: 255 })
    jwt: string;
    
    @Column({ length: 255 })
    device: string;
    
    @Column()
    creationDate: Date;
    
    @Column()
    expirationDate: Date;
}
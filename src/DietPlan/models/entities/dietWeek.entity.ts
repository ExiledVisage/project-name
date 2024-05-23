import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DietPlan } from "./dietPlan.entity";
import { DietDay } from "./dietDay.entity";


@Entity()
export class DietWeek {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string; 

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => DietPlan, (dietPlan) => dietPlan.dietWeeks,{onDelete: 'CASCADE'})
    dietPlan: DietPlan

    @OneToMany(() => DietDay, (dietDay) => dietDay.dietWeek)
    dietDays: DietDay[]
}
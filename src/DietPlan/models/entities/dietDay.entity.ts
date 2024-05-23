import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DietWeek } from "./dietWeek.entity";
import { Meal } from "./meal.entity";


@Entity()
export class DietDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string; //biceps,triceps

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => DietWeek, (dietWeek) => dietWeek.dietDays,{onDelete: 'CASCADE'})
    dietWeek: DietWeek

    @OneToMany(() => Meal, (meal) => meal.dietDay)
    meals: Meal[]
}
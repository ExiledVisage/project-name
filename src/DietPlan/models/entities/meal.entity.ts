// meal.entity.ts
import { Entity, Column, PrimaryGeneratedColumn,ManyToOne, OneToMany } from 'typeorm';
import { Food } from './food.entity';
import { DietDay } from './dietDay.entity';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // breakfast, lunch, dinner, snacks

  @OneToMany(() => Food, (food) => food.meal)
  foods: Food[];

  @ManyToOne(() => DietDay, (dietDay) => dietDay.meals,{onDelete: 'CASCADE'})
  dietDay: DietDay;

}
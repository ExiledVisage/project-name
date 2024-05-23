import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Meal } from './meal.entity';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'calories',  type: 'double precision' }) // Use double precision for decimal values
  calories: number;

  @Column({ name: 'serving_size_g', type: 'double precision' })
  servingSize_g: number;

  @Column({ name: 'fat_total_g', type: 'double precision' })
  fatTotal_g: number;

  @Column({ name: 'fat_saturated_g', type: 'double precision' })
  fatSaturated_g: number;

  @Column({ type: 'double precision' })
  protein_g: number;

  @Column({ name: 'sodium_mg', type: 'double precision' })
  sodium_mg: number;

  @Column({ name: 'potassium_mg', type: 'double precision' })
  potassium_mg: number;

  @Column({ name: 'cholesterol_mg', type: 'double precision' })
  cholesterol_mg: number;

  @Column({ name: 'carbohydrates_total_g', type: 'double precision' })
  carbohydrates_Total_g: number;

  @Column({ type: 'double precision' })
  fiber_g: number;

  @Column({ type: 'double precision' })
  sugar_g: number;

  @ManyToOne(() => Meal, (meal) => meal.foods,{onDelete: 'CASCADE'})
  meal: Meal;
}
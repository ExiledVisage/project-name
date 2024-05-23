import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from 'src/Customer/models/entities/user.entity';
import { DietWeek } from './dietWeek.entity';

@Entity()
export class DietPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.dietPlans,{onDelete: 'CASCADE'})
  user: UserEntity;

  @OneToMany(() => DietWeek, (dietWeek) => dietWeek.dietPlan)
  dietWeeks: DietWeek[];
}
import { UserEntity } from "src/Customer/models/entities/user.entity";
import { Meal } from '../entities/meal.entity';

export interface DietPlan {
  id?: number;
  name?: string;
  user?: UserEntity;
  meals?: Meal[];
}
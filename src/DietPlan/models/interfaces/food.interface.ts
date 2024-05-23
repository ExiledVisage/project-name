import { Meal } from "../entities/meal.entity";

export interface Food {
  id?: number;
  name?: string;
  calorie?: number; 
  amount?: string; 
  meal?: Meal
}
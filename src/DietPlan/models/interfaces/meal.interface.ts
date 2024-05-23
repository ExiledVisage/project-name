// meal.interface.ts
import { DietPlan } from './dietPlan.interface'; // Import DietPlan interface
import { Food } from '../entities/food.entity';

export interface Meal {
  id?: number;
  type?: string;
  foods?: Food[]; // Assuming a OneToMany relationship with Food
  dietPlan?: DietPlan; // Assuming a ManyToOne relationship with DietPlan
}
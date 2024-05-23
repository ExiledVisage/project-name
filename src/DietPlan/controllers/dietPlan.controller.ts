import { Controller, Post ,Body, Param, Get, Delete } from '@nestjs/common';
import { DietPlanService } from '../services/dietPlan.service';
import { DietWeek } from '../models/entities/dietWeek.entity';
import { DietPlan } from '../models/entities/dietPlan.entity';
import { Meal } from '../models/entities/meal.entity';
import { Food } from '../models/entities/food.entity';
import { Observable } from 'rxjs';
import { DietDay } from '../models/entities/dietDay.entity';

@Controller('diet-plan')
export class DietPlanController {
    constructor(private readonly dietPlanService: DietPlanService) {}

    @Post('create-diet-plan')
    createDietPlan(@Body() dietPlanData: { dietPlanName: string, user_id: number }): Observable<DietPlan> {
      const { dietPlanName, user_id } = dietPlanData;
      return this.dietPlanService.createDietPlanForUser(user_id, dietPlanName);
    }
  
    @Post('create-diet-week')
    createDietWeek(@Body() dietWeekData: { dietPlanId: number; dietWeek_name: string }): Observable<DietWeek> {
      const { dietPlanId, dietWeek_name } = dietWeekData;
      return this.dietPlanService.createWeekForDietPlan(dietPlanId, dietWeek_name);
    }
  
    @Post('create-diet-day')
    createDietDay(@Body() dietDayData: { dietWeekId: number; dietDay_name: string }): Observable<DietDay> {
      const { dietWeekId, dietDay_name } = dietDayData;
      return this.dietPlanService.createDayForDietWeek(dietWeekId, dietDay_name);
    }
  
    @Post('create-meal')
    createMeal(@Body() mealData: { dietDay_id: number; meal_type: string }): Observable<Meal> {
      const { dietDay_id, meal_type } = mealData;
      return this.dietPlanService.createMealForDietDay(dietDay_id, meal_type);
    }
  
    @Post('create-food')
    createFood(@Body() foodInfo: { mealId: number, foodData: Food }): Observable<Food> {
      const { mealId, foodData } = foodInfo;
      return this.dietPlanService.createFoodForMeal(mealId, foodData);
    }
  
    @Get('get-diet-plans/:userId')
    getDietPlansForUser(@Param('userId') userId: number): Observable<DietPlan[]> {
      return this.dietPlanService.getDietPlansForUser(userId);
    }
  
    @Get('get-diet-weeks/:dietPlanId')
    getDietWeeksForDietPlan(@Param('dietPlanId') dietPlanId: number): Observable<DietWeek[]> {
      return this.dietPlanService.getDietWeeksForDietPlan(dietPlanId);
    }
  
    @Get('get-diet-days/:dietWeekId')
    getDietDaysForDietWeek(@Param('dietWeekId') dietWeekId: number): Observable<DietDay[]> {
      return this.dietPlanService.getDietDaysForDietWeek(dietWeekId);
    }
  
    @Get('get-meals/:dietDayId')
    getMealsForDietDay(@Param('dietDayId') dietDayId: number): Observable<Meal[]> {
      return this.dietPlanService.getMealsForDay(dietDayId);
    }
  
    @Get('get-foods/:mealId')
    getFoodsForMeal(@Param('mealId') mealId: number): Observable<Food[]> {
      return this.dietPlanService.getFoodsForMeal(mealId);
    }
  
    @Delete('delete-plan/:id')
    deleteDietPlan(@Param('id') id: number): Observable<void> {
      return this.dietPlanService.deleteDietPlan(id);
    }
  
    @Delete('delete-diet-week/:id')
    deleteDietWeek(@Param('id') id: number): Observable<void> {
      return this.dietPlanService.deleteDietWeek(id);
    }
  
    @Delete('delete-diet-day/:id')
    deleteDietDay(@Param('id') id: number): Observable<void> {
      return this.dietPlanService.deleteDietDay(id);
    }
  
    @Delete('delete-meal/:id')
    deleteMeal(@Param('id') id: number): Observable<void> {
      return this.dietPlanService.deleteMeal(id);
    }
  
    @Delete('delete-food/:id')
    deleteFood(@Param('id') id: number): Observable<void> {
      return this.dietPlanService.deleteFood(id);
    }

    
}

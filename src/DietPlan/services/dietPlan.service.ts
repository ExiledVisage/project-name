import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DietPlan } from '../models/entities/dietPlan.entity';
import { Meal } from '../models/entities/meal.entity';
import { Food } from '../models/entities/food.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/Customer/models/entities/user.entity';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { plainToClass,plainToInstance } from 'class-transformer';
import { DietDay } from '../models/entities/dietDay.entity';
import { DietWeek } from '../models/entities/dietWeek.entity';


@Injectable()
export class DietPlanService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(DietPlan) private readonly dietPlanRepository: Repository<DietPlan>,
        @InjectRepository(DietWeek) private readonly dietWeekRepository: Repository<DietWeek>,
        @InjectRepository(DietDay) private readonly dietDayRepository: Repository<DietDay>,
        @InjectRepository(Meal) private readonly mealRepository: Repository<Meal>,
        @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
      ) {}

  
      
      private getUserById(id: number): Observable<UserEntity> {
        return from(
          this.userRepository.findOne(
            {
              where: { id },
            },
          ),
        ).pipe(
          catchError(() => {
            throw new Error('User not found'); // Throw a custom error message
          }),
        );
      }

      private getDietPlanById(dietPlanId: number): Observable<DietPlan> {
        return from(
            this.dietPlanRepository.findOne(
                {
                    where: { id: dietPlanId },
                    relations: ['dietWeeks'], // Assuming you have a 'days' property in your DietPlan entity
                },
            ),
        ).pipe(
            catchError(() => {
                throw new NotFoundException('Diet plan not found'); // Throw a custom error message
            }),
        );
    }

    private getDietWeekById(dietWeekId: number): Observable<DietWeek> {
      return from(
          this.dietWeekRepository.findOne(
              {
                  where: { id: dietWeekId },
                  relations: ['dietDays'], // Assuming you have a 'days' property in your DietPlan entity
              },
          ),
      ).pipe(
          catchError(() => {
              throw new NotFoundException('Diet plan not found'); // Throw a custom error message
          }),
      );
  }

    private getDietDayById(dietDayId: number): Observable<DietDay> {
      return from(
        this.dietDayRepository.findOne(
          {
            where: { id: dietDayId},
            relations: ['meals'],
          },
        ),
      ).pipe(
        catchError(() => {
          throw new NotFoundException('Diet day not found');
        })
      )


    }

    private getMealById(mealId: number): Observable<Meal> {
      return from(
          this.mealRepository.findOne(
              {
                  where: { id: mealId },
                  relations: ['foods'], // Assuming you have a 'foods' property in your Meal entity
              },
          ),
      ).pipe(
          catchError(() => {
              throw new NotFoundException('Meal not found'); // Throw a custom error message
          }),
      );
  }

  private getFoodById(foodId: number): Observable<Food> {
    return from(
      this.foodRepository.findOne(
        
        {
        where: {id: foodId}, 
        relations: ['meal']
      })
    ).pipe(
      catchError(() => {
        throw new NotFoundException('Food not found');
      })
    );
  }



/* --------------------------------------------------------------------------------------------------------- */ 


  createDietPlanForUser(userId: number, dietPlanName: string): Observable<DietPlan> {
   return this.getUserById(userId).pipe(
        switchMap((user: UserEntity) => {
            if (!user) {
                throw new NotFoundException('User not found.');
            }

            const dietPlan = new DietPlan();
            dietPlan.name = dietPlanName;

            // Associate the diet plan with the user
            dietPlan.user = user;

            // You can also create initial meals for the diet plan if needed
            dietPlan.dietWeeks = []; // Assuming 'meals' is a property of DietPlan entity

            // Save the diet plan
            return from(this.dietPlanRepository.save(dietPlan)).pipe(
                switchMap((savedDietPlan: DietPlan) => {
                    // Add the saved diet plan to the user's dietPlans array
                    user.dietPlans = Array.isArray(user.dietPlans) ? user.dietPlans : [];
                    
                    user.dietPlans.push(savedDietPlan);

                    // Save the updated user
                   return from(this.userRepository.save(user)).pipe(
                        switchMap(() => {
                          const plainDietPlan = plainToClass(DietPlan, savedDietPlan, { excludeExtraneousValues: true });

                          // Return the saved diet plan (plain JSON)
                          return of(plainDietPlan);
                        })
                    );
                }),
            );
        }),
    );
  }

  createWeekForDietPlan(dietPlanId: number, dietWeek_name: string): Observable<DietWeek> {
      return this.getDietPlanById(dietPlanId).pipe(
          switchMap((dietPlan: DietPlan) => {
             if (!dietPlan) {
                 throw new NotFoundException('Diet plan not found.');
              }

             const dietWeek = new DietWeek();
             dietWeek.name = dietWeek_name;

             // Initialize an empty array for foods
             dietWeek.dietDays = [];

             // Associate the meal with the diet plan
              dietWeek.dietPlan = dietPlan;
              console.log(dietWeek)
             // Save the meal

             return from(this.dietWeekRepository.save(dietWeek)).pipe(
                 switchMap((savedDietWeek: DietWeek) => {
                     // Add the saved meal to the diet plan's meals array
                     dietPlan.dietWeeks = Array.isArray(dietPlan.dietWeeks) ? dietPlan.dietWeeks: [];
                     dietPlan.dietWeeks.push(savedDietWeek);

                     // Save the updated diet plan
                     return from(this.dietPlanRepository.save(dietPlan)).pipe(
                         switchMap(() => {
                            const plainDietWeek = plainToClass(DietWeek, savedDietWeek, { excludeExtraneousValues: true });
                              // Return the saved meal
                            return of(plainDietWeek);
                         })
                     );
                 }),
             );
         }),
     );
  }

  createDayForDietWeek(dietWeekId: number, dietDay_name: string): Observable<DietDay> {
    return this.getDietWeekById(dietWeekId).pipe(
        switchMap((dietWeek: DietWeek) => {
           if (!dietWeek) {
               throw new NotFoundException('Diet plan not found.');
            }

           const dietDay = new DietDay();
           dietDay.name = dietDay_name;

           // Initialize an empty array for foods
           dietDay.meals = [];

           // Associate the meal with the diet plan
            dietDay.dietWeek = dietWeek;
            console.log(dietDay)
           // Save the meal
           return from(this.dietDayRepository.save(dietDay)).pipe(
               switchMap((savedDietDay: DietDay) => {
                   // Add the saved meal to the diet plan's meals array
                   dietWeek.dietDays = Array.isArray(dietWeek.dietDays) ? dietWeek.dietDays: [];
                   dietWeek.dietDays.push(savedDietDay);

                   // Save the updated diet plan
                   return from(this.dietWeekRepository.save(dietWeek)).pipe(
                       switchMap(() => {
                          const plainDietDay = plainToClass(DietDay, savedDietDay, { excludeExtraneousValues: true });
                            // Return the saved meal
                          return of(plainDietDay);
                       })
                   );
               }),
           );
       }),
   );
}

  createMealForDietDay(dietDay_id: number, meal_name: string): Observable<Meal> {
    return this.getDietDayById(dietDay_id).pipe(
      switchMap((dietDay: DietDay) => {
         if (!dietDay) {
             throw new NotFoundException('Diet plan not found.');
          }

         const meal = new Meal();
         meal.type = meal_name;

         // Initialize an empty array for foods
         meal.foods = [];

         // Associate the meal with the diet plan
          meal.dietDay = dietDay;
          console.log(meal)
         // Save the meal
         return from(this.mealRepository.save(meal)).pipe(
             switchMap((savedMeal: Meal) => {
                 // Add the saved meal to the diet plan's meals array
                 dietDay.meals = Array.isArray(dietDay.meals) ? dietDay.meals: [];
                 dietDay.meals.push(savedMeal);

                 // Save the updated diet plan
                 return from(this.dietDayRepository.save(dietDay)).pipe(
                     switchMap(() => {
                        const plainMeal = plainToClass(Meal, savedMeal, { excludeExtraneousValues: true });
                          // Return the saved meal
                        return of(plainMeal);
                     })
                 );
             }),
         );
     }),
 );
}

  createFoodForMeal(mealId: number, foodData: Food): Observable<Food> {
    console.log(mealId)
    return this.getMealById(mealId).pipe(
        switchMap((meal: Meal) => {
            if (!meal) {
                throw new NotFoundException('Meal not found.');
            }

            console.log('Food Data by postman after entering return:', foodData);
            console.log(foodData.servingSize_g)
            const food = new Food();
            food.name = foodData.name;
            food.calories = foodData.calories;
            food.servingSize_g = foodData.servingSize_g;
            food.fatSaturated_g = foodData.fatSaturated_g;
            food.fatTotal_g = foodData.fatTotal_g;
            food.sodium_mg = foodData.sodium_mg;
            food.potassium_mg = foodData.potassium_mg;
            food.protein_g = foodData.protein_g;
            food.cholesterol_mg = foodData.cholesterol_mg
            food.carbohydrates_Total_g= foodData.carbohydrates_Total_g;
            food.sugar_g = foodData.sugar_g;
            food.fiber_g = foodData.fiber_g;
            
           // Associate the food with the meal
           food.meal = meal;
           console.log('Food Data by food:', food);
           // Save the food
            return from(this.foodRepository.save(food)).pipe(
               switchMap((savedFood: Food) => {
                    // Add the saved food to the meal's foods array
                    meal.foods = Array.isArray(meal.foods) ? meal.foods: [];
                    meal.foods.push(savedFood);

                    // Save the updated meal
                    return from(this.mealRepository.save(meal)).pipe(
                        switchMap(() => {
                          const plainFood = plainToClass(Food, savedFood, { excludeExtraneousValues: true });
                           // Return the saved food
                            return of(plainFood);
                       })
                   );
               }),
           );
       }),
    );
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  getDietPlansForUser(userId: number): Observable<DietPlan[]> {
    return this.getUserById(userId).pipe(
      switchMap((user: UserEntity) => {
        if (!user) {
          throw new NotFoundException('User not found.');
        }
  
        // Load diet plans for the user without associated meals
        return from(this.dietPlanRepository.find({ where: { user: { id: userId} } }));
      }),
    );
  }

  getDietWeeksForDietPlan(dietPlanId: number): Observable<DietWeek[]> {
    return this.getDietPlanById(dietPlanId).pipe(
      switchMap((dietPlan: DietPlan) => {
        if (!dietPlan) {
          throw new NotFoundException('Diet plan not found.');
        }
  
        // Assuming dietPlan.meals is an array of associated meals
        const dietWeeks = dietPlan.dietWeeks || [];
  
        // Return the meals as instances of the Meal class
        return of(dietWeeks.map((dietWeek) => plainToInstance(DietWeek, dietWeek)));
      }),
    );
  }

  getDietDaysForDietWeek(dietWeekId: number): Observable<DietDay[]> {
    return this.getDietWeekById(dietWeekId).pipe(
      switchMap((dietWeek: DietWeek) => {
        if (!dietWeek) {
          throw new NotFoundException('Diet plan not found.');
        }
  
        // Assuming dietPlan.meals is an array of associated meals
        const dietDays = dietWeek.dietDays || [];
  
        // Return the meals as instances of the Meal class
        return of(dietDays.map((dietDay) => plainToInstance(DietDay, dietDay)));
      }),
    );
  }

  getMealsForDay(dietDay_id: number): Observable<Meal[]> {
    return this.getDietDayById(dietDay_id).pipe(
      switchMap((dietDay: DietDay) => {
        if (!dietDay) {
          throw new NotFoundException('Diet plan not found.');
        }
  
        // Assuming dietPlan.meals is an array of associated meals
        const meals = dietDay.meals || [];
  
        // Return the meals as instances of the Meal class
        return of(meals.map((meal) => plainToInstance(Meal, meal)));
      }),
    );
  }

  getFoodsForMeal(mealId: number): Observable<Food[]> {
    return from(this.foodRepository.find({ where: { meal: { id: mealId } } }));
  }

  /*---------------------------------------------------------------------------------------*/

  deleteFood(foodId: number): Observable<void> {
    return this.getFoodById(foodId).pipe(
      switchMap((foundFood) => {
        return from(this.foodRepository.remove(foundFood)).pipe(
          map(() => {}),
          catchError(() => {
            throw new Error(`Failed to delete food with id ${foodId}`);
          })
        );
      })
    );
  }

  deleteDietWeek(dietWeek_id: number): Observable<void> {
    return this.getDietWeekById(dietWeek_id).pipe(
      switchMap((foundDietWeek) => {
        return from(this.dietWeekRepository.remove(foundDietWeek)).pipe(
          map(() => {}), // Map to void
          catchError(() => {
            throw new NotFoundException(`Failed to delete meal with id ${dietWeek_id}`);
          })
        );
      })
    );
  }

  deleteDietDay(dietDay_id: number): Observable<void> {
    return this.getDietDayById(dietDay_id).pipe(
      switchMap((foundDietDay) => {
        return from(this.dietDayRepository.remove(foundDietDay)).pipe(
          map(() => {}), // Map to void
          catchError(() => {
            throw new NotFoundException(`Failed to delete meal with id ${dietDay_id}`);
          })
        );
      })
    );
  }

  deleteMeal(mealId: number): Observable<void> {
    return this.getMealById(mealId).pipe(
      switchMap((foundMeal) => {
        return from(this.mealRepository.remove(foundMeal)).pipe(
          map(() => {}), // Map to void
          catchError(() => {
            throw new NotFoundException(`Failed to delete meal with id ${mealId}`);
          })
        );
      })
    );
  }

  deleteDietPlan(dietPlanId: number): Observable<void> {
    return this.getDietPlanById(dietPlanId).pipe(
      switchMap((foundDietPlan) => {
        return from(this.dietPlanRepository.remove(foundDietPlan)).pipe(
          map(() => {}), // Map to void
          catchError(() => {
            throw new NotFoundException(`Failed to delete diet plan with id ${dietPlanId}`);
          })
        );
      })
    );
  }
}


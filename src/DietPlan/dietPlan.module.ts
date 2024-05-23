import { Module } from '@nestjs/common';
import { DietPlanService } from './services/dietPlan.service';
import { DietPlanController } from './controllers/dietPlan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/Customer/models/entities/user.entity';
import { DietPlan } from './models/entities/dietPlan.entity';
import { Meal } from './models/entities/meal.entity';
import { Food } from './models/entities/food.entity';
import { DietDay} from './models/entities/dietDay.entity';
import { DietWeek } from './models/entities/dietWeek.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, DietPlan, DietWeek, DietDay, Meal, Food])
    ],
    providers: [DietPlanService],
  controllers: [DietPlanController]
})
export class DietPlanModule {

  
}

import { Column, Entity, ManyToOne, OneToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { VIP_STATUS } from "../enums/role.enum";
import { UserGeneratedWorkoutPlan, WorkoutPlan } from "src/Workout/models/entities/workoutPlan.entity";
import { DietPlan } from "src/DietPlan/models/entities/dietPlan.entity";
import { PersonalTrainer } from "src/PersonalTrainer/models/entities/personalTrainer.entity";
import { PT_STATUS } from "../enums/pt_status.enum";
import { SharedWorkoutPlan } from "src/Workout/models/entities/sharedWorkoutPlan.entity";

@Entity('user_info')
@TableInheritance({ column: { type: "enum", enum:PT_STATUS,  name: "type" } })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    age: number;

    @Column({ nullable: true })
    height: number;

    @Column({ nullable: true })
    weight: number;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'enum', enum: VIP_STATUS, default: VIP_STATUS.USER })
    vip_status: VIP_STATUS;

    @Column({ type: 'enum', enum: PT_STATUS, default: PT_STATUS.Customer })
    pt_status: PT_STATUS;

    @OneToMany(() => UserGeneratedWorkoutPlan, (workoutPlan) => workoutPlan.user)
    userGeneratedWorkoutPlans: UserGeneratedWorkoutPlan[];

    @OneToMany(() => DietPlan, (dietPlan) => dietPlan.user)
    dietPlans: DietPlan[];

    @OneToOne(() => PersonalTrainer, (pt) => pt.promotedUser,{nullable: true})
    personalTrainer: PersonalTrainer

    @ManyToOne(() => PersonalTrainer, (pt) => pt.subscribedUsers, {nullable: true})
    assignedPersonalTrainer: PersonalTrainer;

    @OneToOne(() => SharedWorkoutPlan, (sharedWorkoutPlan) => sharedWorkoutPlan.user, { nullable: true })
    @JoinColumn()
    sharedWorkoutPlan: SharedWorkoutPlan;
}
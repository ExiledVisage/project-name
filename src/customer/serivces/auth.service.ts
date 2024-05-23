import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserEntity } from '../models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
 constructor(
    @InjectRepository(UserEntity) 
    private readonly userRepository: Repository<UserEntity>
    ) {}



    registerUser(email: string): Observable<UserEntity> {
        // Create a new user entity
        const user = new UserEntity();
        user.email = email;
    
        // Save the user to the database
        return from(this.userRepository.save(user)).pipe(
          map(savedUser => {
            // Map the saved user before emitting
            return savedUser;
          }),
        );
      }

}

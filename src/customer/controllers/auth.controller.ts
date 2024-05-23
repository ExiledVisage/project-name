import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../serivces/auth.service';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async registerUser(@Body('email') email: string) {
    return this.authService.registerUser(email);
  }
}

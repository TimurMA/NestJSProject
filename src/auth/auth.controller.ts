import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserDTO } from '@auth/models/dto/user.dto';
import { AuthService } from '@auth/auth.service';

import { AuthenticationPrincipal } from '@utils/jwt-auth/jwt-auth.authentication.principal';

@Controller('/api/profile')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('/register')
  register(@Body() userDTO: UserDTO): Observable<UserDTO> {
    return this.userService.register(userDTO);
  }

  @Post('/login')
  login(@Body() userDTO: UserDTO): Observable<UserDTO> {
    return this.userService.login(userDTO);
  }

  @Get('/user/id/:id')
  getUserById(@Param('id') id: string): Observable<UserDTO> {
    return this.userService.findOneById(id);
  }

  @Get('/user/email/:email')
  getUserByEmail(@Param('email') email: string): Observable<UserDTO> {
    return this.userService.findOneByEmail(email);
  }

  @Get('/users')
  getAllUsers(): Observable<UserDTO[]> {
    return this.userService.findAll();
  }

  @Get('/user/token')
  getUser(@AuthenticationPrincipal() user: UserDTO) {
    return user;
  }
}

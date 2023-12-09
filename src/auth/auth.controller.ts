import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserDTO } from '@auth/models/dto/user.dto';
import { AuthService } from '@auth/auth.service';

import { AuthenticationPrincipal } from '@utils/jwt-auth/jwt-auth.authentication.principal';
import { AuthGuard } from '@utils/jwt-auth/jwt-auth.guard';

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

  @UseGuards(AuthGuard)
  @Get('/user/:id')
  getUserById(
    @Param('id') id: string,
    @AuthenticationPrincipal() user: UserDTO,
  ): Observable<UserDTO> {
    console.log(user);
    return this.userService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Get('/user/:email')
  getUserByEmail(@Param('email') email: string): Observable<UserDTO> {
    return this.userService.findOneByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  getAllUsers(): Observable<UserDTO[]> {
    return this.userService.findAll();
  }
}

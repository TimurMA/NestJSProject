import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '@auth/auth.repository';
import { Observable, catchError, from, map, mergeMap, of } from 'rxjs';
import { UserMapper } from '@auth/models/mappers/user.mapper';
import { UserDTO } from '@auth/models/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@auth/models/entities/user.entity';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  private logger: Logger = new Logger('UserService');
  private userMapper: UserMapper = new UserMapper();

  findOneById(id: string): Observable<UserDTO> {
    return from(this.authRepository.getUserById(id)).pipe(
      map((result) => {
        if (!result) {
          throw new UnauthorizedException();
        }
        return this.userMapper.toUserDTO(result);
      }),
      catchError((error) => {
        this.logger.error('Error catched: ', error);
        throw new ServiceUnavailableException(error);
      }),
    );
  }

  findOneByEmail(email: string): Observable<UserDTO> {
    return from(this.authRepository.getUserByEmail(email)).pipe(
      map((result) => {
        if (!result) {
          throw new UnauthorizedException();
        }
        return this.userMapper.toUserDTO(result);
      }),
      catchError((error) => {
        this.logger.error('Error catched: ', error);
        throw new ServiceUnavailableException(error);
      }),
    );
  }

  findAll(): Observable<UserDTO[]> {
    return from(this.authRepository.getAllUsers()).pipe(
      map((users: User[]) => users.map(this.userMapper.toUserDTO)),
    );
  }

  login(userDTO: UserDTO): Observable<UserDTO> {
    return from(this.authRepository.getUserByEmail(userDTO.email)).pipe(
      mergeMap((result) =>
        of(this.userMapper.toUserDTO(result)).pipe(
          mergeMap((user: UserDTO) => {
            if (!compareSync(userDTO.password, result.password)) {
              throw new UnauthorizedException('Authorization error');
            }
            return from(
              this.jwtService.signAsync({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user.id,
              }),
            ).pipe(
              catchError((error) => {
                this.logger.error(error);
                throw new UnauthorizedException();
              }),
              map((token) => {
                user.token = token;
                return user;
              }),
            );
          }),
        ),
      ),
      catchError((error) => {
        this.logger.error('Error catched: ', error);
        throw new ServiceUnavailableException(error);
      }),
    );
  }

  register(userDTO: UserDTO): Observable<UserDTO> {
    return from(
      this.authRepository.createUser(this.userMapper.toUser(userDTO)),
    ).pipe(
      catchError((error) => {
        this.logger.error('Error catched: ', error);
        throw new UnauthorizedException();
      }),
      mergeMap((user: User) =>
        of(this.userMapper.toUserDTO(user)).pipe(
          mergeMap((userDTO: UserDTO) =>
            from(
              this.jwtService.signAsync({
                firstName: userDTO.firstName,
                lastName: userDTO.lastName,
                email: userDTO.email,
                id: userDTO.id,
              }),
            ).pipe(
              map((token) => {
                userDTO.token = token;
                return userDTO;
              }),
              catchError((error) => {
                this.logger.error(error);
                throw new UnauthorizedException();
              }),
            ),
          ),
        ),
      ),
    );
  }
}

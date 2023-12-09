import { User } from '@auth/models/entities/user.entity';
import { UserDTO } from '@auth/models/dto/user.dto';

export class UserMapper {
  toUserDTO(user: User): UserDTO {
    const userDTO = new UserDTO();
    userDTO.email = user.email;
    userDTO.firstName = user.firstName;
    userDTO.lastName = user.lastName;
    userDTO.id = user.id;

    return userDTO;
  }

  toUser(userDTO: UserDTO): User {
    const user = new User();
    user.email = userDTO.email;
    user.password = userDTO.password;
    user.lastName = userDTO.lastName;
    user.firstName = userDTO.firstName;

    return user;
  }
}

import { DataSource, Repository } from 'typeorm';
import { User } from '@auth/models/entities/user.entity';
import { Observable, from } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  getUserById(id: string): Observable<User> {
    return from(this.findOneOrFail({ where: { id } }));
  }

  getUserByEmail(email: string): Observable<User> {
    return from(this.findOneOrFail({ where: { email } }));
  }

  getAllUsers(): Observable<User[]> {
    return from(this.find());
  }

  createUser(user: User): Observable<User> {
    return from(this.save(user));
  }
}

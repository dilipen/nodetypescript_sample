import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

import BaseService from './base.service';

class UserService {
  public baseService = new BaseService();

  public async findAllUser(): Promise< User[] > {
    const users = await this.baseService.findAll('users');
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const user = await this.baseService.findById('users', userId);
    return user;
  }

  public async createUser(userData: CreateUserDto): Promise<any> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");
    const affectedRows = await this.baseService.create('users', userData);
    return affectedRows;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<any> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");
    const hashedPassword = await hash(userData.password, 10);
    userData = {...userData, password: hashedPassword}
    const affectedRows = await this.baseService.update('users', userData, 'id='+userId)
    return affectedRows;
  }

  public async deleteUser(userId: number): Promise<User[]> {
    const affectedRows = await this.baseService.delete('users', 'id='+userId)
    return affectedRows;
  }
}

export default UserService;

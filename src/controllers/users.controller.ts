import { hash } from 'bcrypt';

import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import UserService from '@services/users.service';
import BaseService from '@services/base.service';

class UsersController {
  public userService = new UserService();
  public baseService = new BaseService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();
      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.userService.findUserById(userId);
      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      var userData: CreateUserDto = req.body;
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
      const affectedRows = await this.userService.createUser(userData)
      res.status(201).json({ affectedRows: affectedRows, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: CreateUserDto = req.body;
      const affectedRows = await this.userService.updateUser(userId, userData);
      res.status(200).json({ affectedRows: affectedRows, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const affectedRows = await this.userService.deleteUser(userId);
      res.status(200).json({ affectedRows: affectedRows, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;

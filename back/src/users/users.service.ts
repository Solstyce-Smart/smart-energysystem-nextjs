import { Injectable } from '@nestjs/common';
import { User } from '../entity/Users';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserParams, UpdateUserParams } from './types/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({ ...userDetails });
    return this.userRepository.save(newUser);
  }
  getAllUsers() {
    return this.userRepository.find();
  }
  getOneUser(userId: number) {
    return this.userRepository.findOne({
      select: ['userId', 'username', 'role', 'ewonIds', 'password'],
      where: { userId },
    });
  }
  async updateUser(userId: number, updateUserDetails: UpdateUserParams) {
    const result = await this.userRepository.update(
      { userId },
      { ...updateUserDetails },
    );

    console.log(result);

    if (result.affected === 0) {
      return null;
    }

    const updatedUser = await this.userRepository.findOne({
      select: ['userId', 'username', 'role', 'ewonIds', 'password'],
      where: { userId },
    });

    return updatedUser;
  }
  deleteUser(userId: number) {
    return this.userRepository.delete({ userId });
  }
}

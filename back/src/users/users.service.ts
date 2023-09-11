import { Injectable } from '@nestjs/common';
import { User } from '../entity/Users';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserParams, UpdateUserParams } from './types/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createUser(userDetails: CreateUserParams) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);

    const newUser = this.userRepository.create({
      ...userDetails,
      password: hashedPassword, // Enregistrer le mot de passe haché dans la base de données
    });

    return this.userRepository.save(newUser);
  }
  getAllUsers() {
    return this.userRepository.find();
  }
  getOneUser(userId: number) {
    return this.userRepository.findOne({
      select: ['userId', 'username', 'role', 'ewonIds', 'password'],
      where: { userId },
      relations: ['ewonIds'],
    });
  }
  async updateUser(userId: number, updateUserDetails: UpdateUserParams) {
    if (updateUserDetails.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        updateUserDetails.password,
        saltRounds,
      );
      updateUserDetails.password = hashedPassword;
    }
    const result = await this.userRepository.update(
      { userId },
      { ...updateUserDetails },
    );

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

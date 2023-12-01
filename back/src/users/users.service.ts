import { Injectable } from '@nestjs/common';
import { User } from '../entity/Users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserParams, UpdateUserParams } from './types/types';
import * as bcrypt from 'bcrypt';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createUser(userDetails: CreateUserParams) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);

    try {
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [userDetails.email],
        password: userDetails.password,
        publicMetadata: {
          role: userDetails.role,
        },
      });
      const newUser = this.userRepository.create({
        ...userDetails,
        password: hashedPassword,
        clerkId: clerkUser.id,
      });
      return this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);
    }
  }
  async getAllUsers() {
    try {
      await clerkClient.users.getUserList();
    } catch (error) {
      console.log(error);
    }
    return this.userRepository.find();
  }
  getOneUser(userId: number) {
    return this.userRepository.findOne({
      select: ['userId', 'clerkId', 'email', 'role', 'ewonIds', 'password'],
      where: { userId },
      relations: ['ewonIds'],
    });
  }
  async updateUser(userId: number, updateUserDetails: UpdateUserParams | any) {
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
      select: ['userId', 'email', 'clerkId', 'role', 'ewonIds', 'password'],
      where: { userId },
    });

    console.log(updatedUser);

    try {
      await clerkClient.users.updateUser(updatedUser.clerkId, {
        primaryEmailAddress: 'nouvel-email@example.com',
        password: updatedUser.password,
        publicMetadata: {
          role: updatedUser.role,
        },
        externalID: updatedUser.userId.toString(),
      } as UpdateUserParams | any);
    } catch (error) {
      console.log(error);
    }
    return updatedUser;
  }
  deleteUser(userId: number) {
    return this.userRepository.delete({ userId });
  }
}

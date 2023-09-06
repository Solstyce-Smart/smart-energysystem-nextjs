import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
  @Get(':userId')
  getOneUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getOneUser(userId);
  }
  @Put(':userId')
  async updateUserById(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUser(
      userId,
      updateUserDto,
    );
    return updatedUser;
  }
}

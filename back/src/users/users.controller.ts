import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@ApiTags('Utilisateurs')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Création d'un utilisateur" })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiBody({ type: () => CreateUserDto })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "Récupération de l'intégralité des utilisateurs" })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':userId')
  @ApiOperation({ summary: "Récupération d'un utilisateur" })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
    description: "Id de l'utilisateur",
  })
  getOneUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getOneUser(userId);
  }

  @Put(':userId')
  @ApiOperation({ summary: "Modification d'un utilisateur" })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
    description: "Id de l'utilisateur",
  })
  @ApiBody({ type: () => UpdateUserDto })
  async updateUserById(
    @Body() updateUserDto: CreateUserDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const updatedUser = await this.usersService.updateUser(
      userId,
      updateUserDto,
    );
    return updatedUser;
  }

  @Delete(':userId')
  @ApiOperation({ summary: "Suppression d'un utilisateur" })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
    description: "Id de l'utilisateur",
  })
  async deleteUserById(@Param('userId', ParseIntPipe) userId: number) {
    const result = await this.usersService.deleteUser(userId);

    if (result.affected === 0) {
      return new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}

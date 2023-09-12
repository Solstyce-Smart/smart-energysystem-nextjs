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
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { InstallationsService } from './installations.service';
import { CreateInstallationsDto } from './dto/CreateInstallation.dto';
import { UpdateInstallationDto } from './dto/UpdateInstallation.dto';

@ApiTags('Installations')
@Controller(':userId/installations')
export class InstallationsController {
  constructor(private installationsService: InstallationsService) {}

  @Post()
  @ApiOperation({ summary: "Création d'une installation" })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiBody({ type: () => CreateInstallationsDto })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
    description: "Id de l'utilisateur",
  })
  createInstallation(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createInstallationsDto: CreateInstallationsDto,
  ) {
    return this.installationsService.createInstallation(
      userId,
      createInstallationsDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: "Récupération d'une installation d'un utilisateur" })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé / Aucune installation trouvée',
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
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: "Id de l'installation",
  })
  getInstallationById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) installationId: number,
  ) {
    return this.installationsService.getInstallationById(
      userId,
      installationId,
    );
  }

  @Get()
  @ApiOperation({
    summary: "Récupération de toutes les installations d'un utilisateur",
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé / Aucune installation trouvée',
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
  getAllInstallations(@Param('userId', ParseIntPipe) userId: number) {
    return this.installationsService.getAllInstallations(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: "Modification d'une installation" })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé / Aucune installation trouvée',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiBody({ type: () => UpdateInstallationDto })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
    description: "Id de l'utilisateur",
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: "Id de l'installation",
  })
  updateInstallationById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) installationId: number,
    @Body() updateInstallationDto: UpdateInstallationDto,
  ) {
    return this.installationsService.updateInstallationById(
      userId,
      installationId,
      updateInstallationDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: "Suppression d'une installation" })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé / Aucune installation trouvée',
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
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: "Id de l'installation",
  })
  deleteInstallationById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) installationId: number,
  ) {
    return this.installationsService.deleteInstallationById(
      userId,
      installationId,
    );
  }
}

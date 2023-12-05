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
@Controller('/installations')
export class InstallationsController {
  constructor(private installationsService: InstallationsService) {}

  @Post()
  @ApiOperation({ summary: "Création d'une installation" })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiBody({ type: () => CreateInstallationsDto })
  createInstallation(
    @Body() createInstallationsDto: CreateInstallationsDto,
  ) {
    return this.installationsService.createInstallation(
      createInstallationsDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: "Récupération d'une installation" })
  @ApiResponse({
    status: 404,
    description: 'Aucune installation trouvée',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: "Id de l'installation",
  })
  getInstallationById(
    @Param('id', ParseIntPipe) installationId: number,
  ) {
    return this.installationsService.getInstallationById(
      installationId,
    );
  }

  @Get()
  @ApiOperation({
    summary: "Récupération de toutes les installations",
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune installation trouvée',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  getAllInstallations() {
    return this.installationsService.getAllInstallations();
  }

  @Put(':id')
  @ApiOperation({ summary: "Modification d'une installation" })
  @ApiResponse({
    status: 404,
    description: 'Aucune installation trouvée',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiBody({ type: () => UpdateInstallationDto })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: "Id de l'installation",
  })
  updateInstallationById(
    @Param('id', ParseIntPipe) installationId: number,
    @Body() updateInstallationDto: UpdateInstallationDto,
  ) {
    return this.installationsService.updateInstallationById(
      installationId,
      updateInstallationDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: "Suppression d'une installation" })
  @ApiResponse({
    status: 404,
    description: 'Aucune installation trouvée',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: "Id de l'installation",
  })
  deleteInstallationById(
    @Param('id', ParseIntPipe) installationId: number,
  ) {
    return this.installationsService.deleteInstallationById(
      installationId,
    );
  }
}

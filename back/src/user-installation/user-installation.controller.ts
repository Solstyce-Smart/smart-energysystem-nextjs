import { Controller, Post, Body, Param } from '@nestjs/common';
import { UserInstallationService } from './user-installation.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('user-installation')
export class UserInstallationController {
  constructor(
    private readonly userInstallationService: UserInstallationService,
  ) {}

  @Post(':userId/:installationId')
  @ApiOperation({
    summary: "Liaison d'un utilisateur à une installation",
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
    name: 'installationId',
    type: String,
    required: true,
    description: 'Id de la centrale',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    description: "Id de l'utilisateur",
  })
  async linkUserToInstallation(
    @Param('userId') userId: number,
    @Param('installationId') installationId: number,
  ): Promise<boolean> {
    return this.userInstallationService.linkUserToInstallation(
      userId,
      installationId,
    );
  }
}

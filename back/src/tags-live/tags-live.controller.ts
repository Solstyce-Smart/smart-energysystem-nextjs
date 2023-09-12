import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { TagsLiveService } from './tags-live.service';
import { CreateTagLiveDto } from './dto/CreateTagLive.dto';
import { UpdateTagLiveDto } from './dto/UpdateTagLive.dto';

@ApiTags('Tags en temps réel')
@Controller(':userId/installations/:id/tags-live')
export class TagsLiveController {
  constructor(private tagsLiveService: TagsLiveService) {}

  @Get()
  @ApiOperation({ summary: "Récupération des tags de l'automate" })
  @ApiResponse({
    status: 404,
    description:
      'Aucun utilisateur trouvé / Aucune installation trouvée / Aucun automate trouvé',
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
  getTagsLive(
    @Param('userId') userId: number,
    @Param('id') installationId: number,
  ) {
    return this.tagsLiveService.getTagsLive(userId, installationId);
  }

  @Post()
  @ApiOperation({ summary: "Ajout des tags de l'automate" })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé / Aucune installation trouvée',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiBody({ type: () => CreateTagLiveDto })
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
  createTagLive(
    @Param('userId') userId: number,
    @Param('id') installationId: number,
    @Body() createTagLiveDto: CreateTagLiveDto,
  ) {
    return this.tagsLiveService.createTagLive(
      userId,
      installationId,
      createTagLiveDto,
    );
  }
  @ApiOperation({ summary: "Modification des tags de l'automate" })
  @ApiResponse({
    status: 404,
    description:
      'Aucun utilisateur trouvé / Aucune installation trouvée / Aucun automate trouvé',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @Put(':tagId')
  @ApiBody({ type: () => UpdateTagLiveDto })
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
  @ApiParam({
    name: 'tagId',
    type: Number,
    required: true,
    description: 'Id du tag',
  })
  updateTagLive(
    @Param('userId') userId: number,
    @Param('id') installationId: number,
    @Param('tagId') tagId: number,
    @Body() updateTagLiveDto: UpdateTagLiveDto,
  ) {
    return this.tagsLiveService.updateTagLive(
      userId,
      installationId,
      tagId,
      updateTagLiveDto,
    );
  }

  @Delete(':tagId')
  @ApiOperation({ summary: "Suppression des tags de l'automate" })
  @ApiResponse({
    status: 404,
    description:
      'Aucun utilisateur trouvé / Aucune installation trouvée / Aucun automate trouvé',
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
  @ApiParam({
    name: 'tagId',
    type: Number,
    required: true,
    description: 'Id du tag',
  })
  deleteTagLive(
    @Param('userId') userId: number,
    @Param('id') installationId: number,
    @Param('tagId') tagId: number,
  ) {
    return this.tagsLiveService.deleteTagLive(userId, installationId, tagId);
  }
}

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { searchService } from './search.service';
import { PostDatasDto } from './dto/PostDatas.dto';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import dotenv from 'dotenv';

dotenv.config();

const index = process.env.ELASTICSEARCH_INDEX;

@ApiTags('Historique des tags')
@Controller('elastic')
export class searchController {
  constructor(private readonly searchService: searchService) {}

  @Get(`${index}/:ewonId`)
  @ApiOperation({
    summary: "Récupération de l'historique des tags de l'automate",
  })
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
    name: 'ewonId',
    type: String,
    required: true,
    description: 'Id de la centrale',
  })
  async getDatasByEwonId(@Param('ewonId') ewonId: string) {
    const result = await this.searchService.getDatasByEwonId(ewonId);
    return result;
  }

  @Post(index)
  @ApiOperation({ summary: 'Mise en historique des tags-live' })
  @ApiResponse({
    status: 404,
    description:
      'Aucun utilisateur trouvé / Aucune installation trouvée / Aucun automate trouvé',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiBody({ type: () => PostDatasDto })
  async postDatas(@Body() data: PostDatasDto[]) {
    const result = await this.searchService.postDatas(data);
    return result;
  }

  @Get(`${index}/:ewonId/:tagName`)
  @ApiOperation({
    summary: "Récupération de l'historique d'un tag de l'automate",
  })
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
    name: 'ewonId',
    type: String,
    required: true,
    description: 'Id de la centrale',
  })
  @ApiParam({
    name: 'tagName',
    type: String,
    required: true,
    description: 'Nom du tag',
  })
  async getDatasByTagsName(
    @Param('ewonId') ewonId: string,
    @Param('tagName') tagName: string,
  ) {
    const result = await this.searchService.getDatasByTagsName(ewonId, tagName);
    return result;
  }
}

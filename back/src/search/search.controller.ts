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

  @Get(index)
  @ApiOperation({ summary: "Récupération de l'historique des tags" })
  @ApiResponse({ status: 200, type: () => PostDatasDto })
  async getDatasByEwonId() {
    const result = await this.searchService.getDatasByEwonId();
    return result;
  }
  @ApiResponse({
    status: 404,
    description: "Pas d'historique pour cet automate",
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @Post(index)
  @ApiOperation({ summary: "Ajout des tags à l'historique" })
  @ApiResponse({
    status: 404,
    description: 'Aucun utilisateur trouvé / Aucune installation trouvée',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  @ApiBody({ type: () => PostDatasDto })
  async postDatas(@Body() data: PostDatasDto) {
    const result = await this.searchService.postDatas(data);
    return result;
  }
}

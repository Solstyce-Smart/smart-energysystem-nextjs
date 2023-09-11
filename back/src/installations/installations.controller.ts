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
import { InstallationsService } from './installations.service';
import { CreateInstallationsDto } from './dto/CreateInstallation.dto';

@Controller(':userId/installations')
export class InstallationsController {
  constructor(private installationsService: InstallationsService) {}

  @Post()
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
  getAllInstallations(@Param('userId', ParseIntPipe) userId: number) {
    return this.installationsService.getAllInstallations(userId);
  }
}

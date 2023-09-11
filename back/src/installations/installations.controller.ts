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
import { UpdateInstallationDto } from './dto/UpdateInstallation.dto';

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

  @Put(':id')
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

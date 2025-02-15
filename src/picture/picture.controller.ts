import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/decorators/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Post('/upload-for-car/:idCar')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Param('idCar') idCar: number, @Body() createPictureDto: CreatePictureDto) {
    return this.pictureService.create(file,idCar,createPictureDto);
  }

  @Get('/car/:idCar')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findOne(@Param('idCar') idCar: number) {
    return this.pictureService.getPicturesByCar(idCar);
  }
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.pictureService.remove(+id);
  }
}

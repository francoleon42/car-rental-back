import { Expose, Type } from 'class-transformer';
import { CarResponseDTO } from './car-response-dto';
import { PictureResponseDto } from '../../picture/dto/picture-response-dto';

export class CarDetailResponseDto {

  @Expose()
  carResponseDTO: CarResponseDTO;

  @Expose()
  @Type(() => PictureResponseDto)
  picturesResponseDTO: PictureResponseDto[];

}

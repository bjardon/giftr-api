import { OmitType } from '@nestjs/swagger';
import { UserEntityDto } from './user-entity.dto';

export class UpdateUserDto extends OmitType(UserEntityDto, ['firebaseId']) {}

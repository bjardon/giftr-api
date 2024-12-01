import { OmitType } from '@nestjs/swagger';
import { GiftExchangeEntityDto } from './gift-exchange-entity.dto';

export class CreateGiftExchangeDto extends OmitType(GiftExchangeEntityDto, [
    'drawnOn',
    '_organizer',
]) {}

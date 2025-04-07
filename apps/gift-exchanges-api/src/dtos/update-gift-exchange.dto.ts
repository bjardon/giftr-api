import { PartialType } from '@nestjs/swagger';
import { CreateGiftExchangeDto } from './create-gift-exchange.dto';

export class UpdateGiftExchangeDto extends PartialType(CreateGiftExchangeDto) {}

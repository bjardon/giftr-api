import { PartialType } from '@nestjs/swagger';
import { CreateWishListItemDto } from './create-wish-list-item.dto';

export class UpdateWishListItemDto extends PartialType(CreateWishListItemDto) {}

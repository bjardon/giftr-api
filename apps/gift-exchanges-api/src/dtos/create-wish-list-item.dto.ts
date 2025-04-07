import { OmitType } from '@nestjs/swagger';
import { WishListItemEntityDto } from './wish-list-item-entity.dto';

export class CreateWishListItemDto extends OmitType(
    WishListItemEntityDto,
    [],
) {}

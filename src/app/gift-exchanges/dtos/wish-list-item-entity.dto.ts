import { ApiProperty, OmitType } from '@nestjs/swagger';
import { WishListItemEntity } from '../schemas';

export class WishListItemEntityDto extends OmitType(WishListItemEntity, [
    '_participant',
]) {
    @ApiProperty({
        type: String,
        description: '',
        nullable: false,
    })
    name: string;

    @ApiProperty({
        type: String,
        description: '',
        nullable: false,
    })
    linkOrStore: string;
}

import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
    ParticipantEntity,
    WishListItemEntity,
} from '@app/gift-exchanges/schemas';
import { ObjectId } from 'mongoose';
import { UserEntityDto } from '@app/users/dtos';

export class ParticipantEntityDto extends OmitType(ParticipantEntity, []) {
    @ApiProperty({
        type: String,
        description: '',
        nullable: true,
    })
    address: string;

    @ApiProperty({
        type: String,
        description: '',
        nullable: false,
    })
    addedOn: Date;

    @ApiProperty({
        type: String,
        format: 'date',
        nullable: true,
    })
    acknowledgedOn: Date;

    @ApiProperty({
        type: String,
        format: 'ObjectId',
        nullable: false,
    })
    _exchange: ObjectId;

    @ApiProperty({
        type: String,
        format: 'ObjectId',
        nullable: false,
    })
    _user: ObjectId;

    @ApiProperty({
        type: String,
        format: 'ObjectId',
        nullable: false,
    })
    _giftee: ObjectId;

    @ApiProperty({
        type: UserEntityDto,
        nullable: true,
    })
    user: Record<string, unknown>;

    @ApiProperty({
        type: ParticipantEntityDto,
        nullable: true,
    })
    giftee: Record<string, unknown>;

    @ApiProperty({
        type: WishListItemEntity,
        isArray: true,
        nullable: true,
    })
    wishList: Record<string, unknown>[];
}

import { ApiProperty, OmitType } from '@nestjs/swagger';
import { GiftExchangeEntity } from '../schemas';
import { ObjectId } from 'mongoose';

export class GiftExchangeEntityDto extends OmitType(GiftExchangeEntity, []) {
    @ApiProperty({
        type: String,
        description: '',
        nullable: false,
    })
    title: string;

    @ApiProperty({
        type: String,
        description: '',
        nullable: true,
    })
    topic: string;

    @ApiProperty({
        type: String,
        description: '',
        nullable: true,
    })
    instructions: string;

    @ApiProperty({
        type: Number,
        description: '',
        nullable: true,
    })
    spendAmount: number;

    @ApiProperty({
        type: Date,
        description: '',
        nullable: true,
    })
    scheduledOn: Date;

    @ApiProperty({
        type: String,
        description: '',
        nullable: false,
    })
    _organizer: ObjectId;
}

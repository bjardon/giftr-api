import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ParticipantEntity } from '@app/gift-exchanges/schemas';
import { ObjectId } from 'mongoose';

export class ParticipantEntityDto extends OmitType(ParticipantEntity, []) {
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
}

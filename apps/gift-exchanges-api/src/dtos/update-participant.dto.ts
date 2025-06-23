import { OmitType, PartialType } from '@nestjs/swagger';
import { ParticipantEntityDto } from './participant-entity.dto';

export class UpdateParticipantDto extends PartialType(
    OmitType(ParticipantEntityDto, [
        '_exchange',
        '_user',
        'acknowledgedOn',
        'addedOn',
    ]),
) {}

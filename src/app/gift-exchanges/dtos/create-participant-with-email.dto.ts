import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantWithEmailDto {
    @ApiProperty({
        type: String,
        description: '',
        nullable: false,
    })
    email: string;

    @ApiProperty({
        type: String,
        description: '',
        nullable: false,
    })
    name: string;
}

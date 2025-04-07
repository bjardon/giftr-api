import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserEntity } from '@shared/users';

export class UserEntityDto extends OmitType(UserEntity, []) {
    @ApiProperty({
        type: String,
        description: "The user's email",
        nullable: false,
    })
    email: string;

    @ApiProperty({
        type: String,
        description: "The user's display name",
        nullable: false,
    })
    name: string;

    @ApiProperty({
        type: String,
        description: 'The Firebase Auth ID corresponding to this user',
        nullable: false,
    })
    firebaseId: string;
}

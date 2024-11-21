import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/auth/guards';
import { UsersService } from '@app/users/services';
import { User } from '@app/users/decorators';
import { UserDocument } from '@app/users/schemas';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntityDto } from '../dtos/user-entity.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private users: UsersService) {}

    @Get('whoami')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Get current user',
        description:
            'Returns the user entity that corresponds to the token in the Auth header',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: UserEntityDto,
        description: 'The user entity',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing Auth header or invalid Auth token',
    })
    async whoAmI(@User() user: UserDocument) {
        return user;
    }
}

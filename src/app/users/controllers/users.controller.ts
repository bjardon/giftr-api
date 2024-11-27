import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
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
import { UpdateUserDto, UserEntityDto } from '@app/users/dtos';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private users: UsersService) {}

    @Get('self')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Get current user',
        description:
            'Returns the user entity that corresponds to the signed-in user',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: UserEntityDto,
        description: 'The user entity',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing Auth header or invalid Auth token',
    })
    async getSelf(@User() user: UserDocument) {
        return user;
    }

    @Patch('self')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Update current user',
        description:
            'Updates and returns the user entity that correspondes to the signed-in user',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: UserEntityDto,
        description: 'The user entity',
    })
    async patchSelf(@User() user: UserDocument, @Body() data: UpdateUserDto) {
        user = await this.users.updateById(user._id, data);

        return user;
    }
}

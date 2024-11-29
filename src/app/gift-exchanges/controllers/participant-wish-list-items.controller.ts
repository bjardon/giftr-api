import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@app/auth/guards';
import { UserDocument } from '@app/users/schemas';
import { WishListItemEntityDto, CreateWishListItemDto } from '../dtos';
import { WishListItemDocument } from '../schemas';
import { WishListItemsService } from '../services';
import { Types } from 'mongoose';
import { User } from '@app/users/decorators';

@ApiTags('Participants/WishListItems')
@Controller('participants/:participantId/wish-list-items')
export class ParticipantWishListItemsController {
    constructor(private readonly wishListItems: WishListItemsService) {}

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Get participant wish-list items',
        description:
            'Returns a collection of wish-list items owned by the specified participant',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: WishListItemEntityDto,
        isArray: true,
        description: 'The wish-list item entities',
    })
    async find(
        @User() user: UserDocument,
        @Param('participantId') participantId: string,
    ): Promise<WishListItemDocument[]> {
        const wishListItems = await this.wishListItems.find({
            _participant: participantId,
        });

        return wishListItems;
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Create wish-list item',
        description:
            'Creates and returns a wish-list item associating it with the specified participant',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: WishListItemEntityDto,
        description: 'The wish-list item entity',
    })
    async create(
        @Param('participantId') participantId: string,
        @Body() data: CreateWishListItemDto,
    ): Promise<WishListItemDocument> {
        const wishListItem = await this.wishListItems.create({
            _participant: new Types.ObjectId(participantId),
            ...data,
        });

        return wishListItem;
    }
}

import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { WishListItemsService } from '../services';
import { UpdateWishListItemDto, WishListItemEntityDto } from '../dtos';
import { WishListItemDocument } from '../schemas';
import { AuthGuard } from '@app/auth/guards';

@ApiTags('WishListItems')
@Controller('wish-list-items')
export class WishListItemsController {
    constructor(private readonly wishListItems: WishListItemsService) {}

    @Patch(':wishListItemId')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Update wish-list item',
        description: 'Updates and returns a wish-list item entity',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: WishListItemEntityDto,
        description: 'The wish-list item entity',
    })
    async updateById(
        @Param('wishListItemId') wishListItemId: string,
        @Body() data: UpdateWishListItemDto,
    ): Promise<WishListItemDocument> {
        const wishListItem = await this.wishListItems.updateById(
            wishListItemId,
            { $set: data },
        );

        return wishListItem;
    }

    @Delete(':wishListItemId')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Delete a wish-list item',
        description: 'Deletes and returns a wish-list item entity',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: WishListItemEntityDto,
        description: 'The wish-list item entity',
    })
    async deleteById(
        @Param('wishListItemId') wishListItemId: string,
    ): Promise<WishListItemDocument> {
        const wishListItem = this.wishListItems.deleteById(wishListItemId);

        return wishListItem;
    }
}

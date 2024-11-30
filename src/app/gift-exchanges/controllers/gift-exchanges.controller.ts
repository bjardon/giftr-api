import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@app/auth/guards';
import { User } from '@app/users/decorators';
import { UserDocument } from '@app/users/schemas';
import { EmailsService } from '@app/emails/services';
import {
    CreateGiftExchangeDto,
    GiftExchangeEntityDto,
    UpdateGiftExchangeDto,
} from '@app/gift-exchanges/dtos';
import { GiftExchangeDocument } from '@app/gift-exchanges/schemas';
import {
    ParticipantsService,
    GiftExchangesService,
} from '@app/gift-exchanges/services';
import { first, isEmpty, shuffle } from 'lodash';
import { EMAIL_TEMPLATES } from '../constants';

@ApiTags('GiftExchanges')
@Controller('gift-exchanges')
export class GiftExchangesController {
    constructor(
        private readonly giftExchanges: GiftExchangesService,
        private readonly participants: ParticipantsService,
        private readonly emails: EmailsService,
    ) {}

    @Get('own')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Get own gift exchanges',
        description:
            'Returns a collection of gift exchange entities created by the authenticated user',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: GiftExchangeEntityDto,
        isArray: true,
        description: 'The gift exchange entities',
    })
    async findOwn(@User() user: UserDocument): Promise<GiftExchangeDocument[]> {
        const exchanges = await this.giftExchanges.find({
            _organizer: user._id,
        });

        return exchanges;
    }

    @Get('participating')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Get participating gift exchanges',
        description:
            'Returns a collection of gift exchange entities in which the authenticated user is participating',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: GiftExchangeEntityDto,
        isArray: true,
        description: 'The gift exchange entities',
    })
    async findParticipating(
        @User() user: UserDocument,
    ): Promise<GiftExchangeDocument[]> {
        const participations = await this.participants.find({
            _user: user._id,
        });

        if (isEmpty(participations)) return [];

        const exchangeIds = participations.map((doc) => doc._exchange);
        const exchanges = await this.giftExchanges.find({
            _id: { $in: exchangeIds },
        });

        return exchanges;
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Create gift exchange',
        description:
            'Creates and returns a gift exchange entity associating it with the authenticated user',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: GiftExchangeEntityDto,
        description: 'The gift exchange entity',
    })
    async create(
        @User() user: UserDocument,
        @Body() data: CreateGiftExchangeDto,
    ): Promise<GiftExchangeDocument> {
        const exchange = await this.giftExchanges.create({
            ...data,
            _organizer: user._id,
        });

        return exchange;
    }

    @Patch(':exchangeId')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Update gift exchange',
        description:
            'Updates and returns a gift exchange entity associated with the authenticated user',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: GiftExchangeEntityDto,
        description: 'The gift exchange entity',
    })
    async updateById(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
        @Body() data: UpdateGiftExchangeDto,
    ): Promise<GiftExchangeDocument> {
        const exchange = await this.giftExchanges.updateOne(
            { _id: exchangeId, _organizer: user._id },
            { $set: data },
        );

        return exchange;
    }

    @Post(':exchangeId/resend-welcome')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Resend welcome email',
        description:
            'Resends the welcome email to all participants in the gift exchange',
    })
    @ApiBearerAuth()
    async resendWelcomeEmailById(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
    ) {
        const exchange = await this.giftExchanges.findById(exchangeId);

        if (!user._id.equals(exchange._organizer))
            throw new UnauthorizedException('giftexchanges.organizer.match');

        const participants = await this.participants.find(
            {
                _exchange: exchange._id,
            },
            { populate: ['user'] },
        );

        const to = participants.map(({ user }) => ({
            email: user.email,
            name: user.name,
        }));
        const params = {
            giftExchange: exchange.toObject({ virtuals: true }),
            organizer: user.toObject({ virtuals: true }),
        };

        await this.emails.sendEmail({
            templateId: EMAIL_TEMPLATES.WELCOME_EMAIL,
            to,
            params,
        });
    }

    @Patch(':exchangeId/draw-names')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Draw gift exchange',
        description:
            'Randomly draws names for every acknowledged participant in the gift exchange',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: GiftExchangeEntityDto,
        description: 'The gift exchange entity',
    })
    async drawNamesById(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
    ): Promise<any> {
        const exchange = await this.giftExchanges.findById(exchangeId);

        if (!user._id.equals(exchange._organizer))
            throw new UnauthorizedException('giftexchanges.organizer.match');

        const participants = await this.participants.find({
            _exchange: exchange._id,
            acknowledgedOn: { $exists: true, $ne: null },
        });

        if (isEmpty(participants))
            throw new ConflictException(
                'giftexchanges.participants.insufficient',
            );

        const shuffledParticipants = shuffle(participants);

        for (const [index, participant] of shuffledParticipants.entries()) {
            const current = participant._id;
            const next =
                index < shuffledParticipants.length - 1
                    ? shuffledParticipants[index + 1]._id
                    : first(shuffledParticipants)._id;

            await this.participants.updateById(current, { _giftee: next });
        }

        return this.giftExchanges.updateById(exchange._id, {
            drawnOn: new Date(),
        });
    }

    @Post(':exchangeId/resend-draw')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Resend draw email',
        description:
            'Resends the draw result email to all participants in the gift exchange',
    })
    @ApiBearerAuth()
    async resendDrawById(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
    ) {
        const exchange = await this.giftExchanges.findById(exchangeId);

        if (!user._id.equals(exchange._organizer))
            throw new UnauthorizedException('giftexchanges.organizer.match');

        if (!exchange.drawnOn)
            throw new ConflictException('giftexchanges.draw.required');

        const participants = await this.participants.find(
            {
                _exchange: exchange._id,
                acknowledgedOn: { $exists: true, $ne: null },
            },
            { populate: ['user', 'giftee'] },
        );

        await Promise.all(
            participants.map(async (participant) => {
                const { user, giftee } = participant;

                const to = [{ email: user.email, name: user.name }];
                const params = {
                    giftExchange: exchange.toObject({ virtuals: true }),
                    organizer: user.toObject({ virtuals: true }),
                    giftee: giftee.toObject({ virtuals: true }),
                };

                await this.emails.sendEmail({
                    templateId: EMAIL_TEMPLATES.DRAW_EMAIL,
                    to,
                    params,
                });
            }),
        );
    }

    @Delete(':exchangeId')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Delete gift exchange',
        description:
            'Deletes a gift exchange associated with the authenticated user',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: GiftExchangeEntityDto,
        description: 'The gift exchange entity',
    })
    async deleteById(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
    ): Promise<unknown> {
        const participants = await this.participants.find({
            _exchange: exchangeId,
            acknowledgedOn: { $exists: true, $ne: null },
        });

        if (!isEmpty(participants))
            throw new ConflictException(
                'giftexchanges.participants.acknowledged',
            );

        const exchange = await this.giftExchanges.deleteOne({
            _id: exchangeId,
            _organizer: user._id,
        });

        return exchange;
    }
}

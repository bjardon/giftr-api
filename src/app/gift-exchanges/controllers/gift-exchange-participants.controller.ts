import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
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
import { UsersService } from '@app/users/services';
import {
    CreateParticipantWithEmailDto,
    ParticipantEntityDto,
} from '@app/gift-exchanges/dtos';
import { ParticipantDocument } from '@app/gift-exchanges/schemas';
import { ParticipantsService } from '@app/gift-exchanges/services';
import { Types } from 'mongoose';

@ApiTags('GiftExchanges/Participants')
@Controller('gift-exchanges/:exchangeId/participants')
export class GiftExchangeParticipantsController {
    constructor(
        private readonly users: UsersService,
        private readonly participants: ParticipantsService,
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Get gift exchange participants',
        description:
            'Returns a collection of participants in the specified gift exchange',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: ParticipantEntityDto,
        isArray: true,
        description: 'The participant entities',
    })
    async find(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
    ): Promise<ParticipantDocument[]> {
        const participants = await this.participants.find({
            _exchange: exchangeId,
        });

        return participants;
    }

    @Post('email')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Create participant',
        description:
            'Creates and returns a participant associating them with the specified gift exchange',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: ParticipantEntityDto,
        description: 'The participant entity',
    })
    async createWithEmail(
        @Param('exchangeId') exchangeId: string,
        @Body() data: CreateParticipantWithEmailDto,
    ): Promise<ParticipantDocument> {
        const user = await this.users.findOrCreate({ email: data.email }, data);

        const participant = await this.participants.create({
            _exchange: new Types.ObjectId(exchangeId),
            _user: user._id,
            addedOn: new Date(),
        });

        return participant;
    }

    @Post('self')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Add self as participant',
        description:
            'Creates and returns a participant associating the current user to the specified gift exchange',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: ParticipantEntityDto,
        description: 'The participant entity',
    })
    async createAsSelf(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
    ): Promise<ParticipantDocument> {
        const participant = await this.participants.create({
            _exchange: new Types.ObjectId(exchangeId),
            _user: user._id,
            acknowledgedOn: new Date(),
            addedOn: new Date(),
        });

        return participant;
    }

    @Patch('acknowledge/self')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Acknowledge self as participant',
        description:
            'Updates and returns a participant acknowledging the participation as the current user',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: ParticipantEntityDto,
        description: 'The participant entity',
    })
    async acknowledgeAsSelf(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
    ): Promise<ParticipantDocument> {
        const participant = await this.participants.updateOne(
            {
                _exchange: exchangeId,
                _user: user._id,
            },
            { acknowledgedOn: new Date() },
        );

        return participant;
    }

    @Delete(':participantId')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Remove participant',
        description:
            'Removes and returns the participant from the specified gift exchange',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: ParticipantEntityDto,
        description: 'The participant entity',
    })
    async deleteById(
        @Param('exchangeId') exchangeId: string,
        @Param('participantId') participantId: string,
    ): Promise<ParticipantDocument> {
        const participant = await this.participants.deleteOne({
            _exchange: exchangeId,
            _id: participantId,
        });

        return participant;
    }
}
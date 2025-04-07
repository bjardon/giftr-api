import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
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
import { Types } from 'mongoose';
import { AuthGuard } from '@shared/auth';
import { User, UserDocument, UsersService } from '@shared/users';
import { CreateParticipantWithEmailDto, ParticipantEntityDto } from '../dtos';
import { ParticipantDocument } from '../schemas';
import { ParticipantsService } from '../services';

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
        const participants = await this.participants.find(
            {
                _exchange: exchangeId,
            },
            { populate: ['user'] },
        );

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

    @Get('self')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Get own participant',
        description:
            'Returns the participant entity corresponding to the signed in user',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: ParticipantEntityDto,
        description: 'The participant entity',
    })
    async getSelf(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
    ): Promise<ParticipantDocument> {
        const participant = await this.participants.findOne(
            {
                _exchange: exchangeId,
                _user: user._id,
            },
            { populate: ['user'] },
        );

        return participant;
    }

    @Get('giftee')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Get own giftee',
        description:
            'Returns the participant entity corresponding to the signed in user giftee',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: ParticipantEntityDto,
        description: 'The participant entity',
    })
    async getOwnGiftee(
        @User() user: UserDocument,
        @Param('exchangeId') exchangeId: string,
    ): Promise<ParticipantDocument> {
        const participant = await this.participants.findOne(
            {
                _exchange: exchangeId,
                _user: user._id,
            },
            { populate: ['user'] },
        );

        if (!participant) throw new NotFoundException('participant.notfound');

        if (!participant._giftee)
            throw new ConflictException('giftexchanges.draw.pending');

        const giftee = await this.participants.findOne(
            { _id: participant._giftee },
            { populate: ['wishList'] },
        );

        return giftee;
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

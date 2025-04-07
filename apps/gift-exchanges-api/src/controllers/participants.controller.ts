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
import { AuthGuard } from '@shared/auth';
import { User, UserDocument } from '@shared/users';
import { ParticipantEntityDto, UpdateParticipantDto } from '../dtos';
import { ParticipantDocument } from '../schemas';
import { ParticipantsService } from '../services';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantsController {
    constructor(private readonly participants: ParticipantsService) {}

    @Patch(':participantId')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Update participant',
        description:
            'Updates and returns the participant identified by the provided id',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: ParticipantEntityDto,
        description: 'The participant entity',
    })
    async updateById(
        @User() user: UserDocument,
        @Param('participantId') participantId: string,
        @Body() data: UpdateParticipantDto,
    ): Promise<ParticipantDocument> {
        const participant = await this.participants.updateOne(
            {
                _id: participantId,
                _user: user._id,
            },
            { $set: data },
        );

        return participant;
    }

    @Patch(':participantId/acknowledge')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Acknowledge participant',
        description:
            'Updates and returns the participant acknowledging and accepting their participation',
    })
    @ApiBearerAuth()
    @ApiOkResponse({
        type: ParticipantEntityDto,
        description: 'The participant entity',
    })
    async acknowledgeById(
        @Param('exchangeId') exchangeId: string,
        @Param('participantId') participantId: string,
    ): Promise<ParticipantDocument> {
        const participant = this.participants.updateOne(
            {
                _exchange: exchangeId,
                _id: participantId,
            },
            { $set: { acknowledgedOn: new Date() } },
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

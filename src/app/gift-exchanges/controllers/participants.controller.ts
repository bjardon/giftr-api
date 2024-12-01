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
import { AuthGuard } from '@app/auth/guards';
import { ParticipantsService } from '@app/gift-exchanges/services';
import {
    ParticipantEntityDto,
    UpdateParticipantDto,
} from '@app/gift-exchanges/dtos';
import { ParticipantDocument } from '@app/gift-exchanges/schemas';
import { User } from '@app/users/decorators';
import { UserDocument } from '@app/users/schemas';

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

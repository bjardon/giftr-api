import { Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@app/auth/guards';
import { ParticipantsService } from '@app/gift-exchanges/services';
import { ParticipantEntityDto } from '@app/gift-exchanges/dtos';
import { ParticipantDocument } from '@app/gift-exchanges/schemas';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantsController {
    constructor(private readonly participants: ParticipantsService) {}

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

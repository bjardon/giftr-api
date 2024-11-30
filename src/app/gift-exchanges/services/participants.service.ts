import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { COLLECTIONS } from '@app/gift-exchanges/constants';
import {
    ParticipantDocument,
    ParticipantEntity,
} from '@app/gift-exchanges/schemas';

@Injectable()
export class ParticipantsService {
    constructor(
        @InjectModel(COLLECTIONS.Participant)
        private readonly model: Model<ParticipantDocument>,
    ) {}

    async find(
        filter: FilterQuery<ParticipantDocument>,
        options: { populate?: string[] } = {},
    ) {
        return await this.model.find(filter).populate(options.populate ?? []);
    }

    async findById(id: string | Types.ObjectId) {
        return this.model.findById(id);
    }

    async findOne(
        filter: FilterQuery<ParticipantDocument>,
        options: { populate?: string[] } = {},
    ) {
        return this.model.findOne(filter).populate(options.populate ?? []);
    }

    async create(data: Partial<ParticipantEntity>) {
        return this.model.create(data);
    }

    async updateById(
        id: string | Types.ObjectId,
        update: UpdateQuery<ParticipantDocument>,
    ) {
        return this.model.findByIdAndUpdate(id, update, { new: true });
    }

    async updateOne(
        filter: FilterQuery<ParticipantDocument>,
        update: UpdateQuery<ParticipantDocument>,
    ) {
        return this.model.findOneAndUpdate(filter, update, { new: true });
    }

    async upsert(
        filter: FilterQuery<ParticipantDocument>,
        upsert: UpdateQuery<ParticipantDocument>,
    ) {
        return this.model.findOneAndUpdate(filter, upsert, {
            new: true,
            upsert: true,
        });
    }

    async deleteById(id: string | Types.ObjectId) {
        return this.model.findByIdAndDelete(id);
    }

    async deleteOne(filter: FilterQuery<ParticipantDocument>) {
        return this.model.findOneAndDelete(filter);
    }
}

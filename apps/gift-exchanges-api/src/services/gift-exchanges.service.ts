import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { GIFT_EXCHANGES_MODULE_COLLECTIONS } from '../constants';
import { GiftExchangeDocument, GiftExchangeEntity } from '../schemas';

@Injectable()
export class GiftExchangesService {
    constructor(
        @InjectModel(GIFT_EXCHANGES_MODULE_COLLECTIONS.GiftExchange)
        private readonly model: Model<GiftExchangeDocument>,
    ) {}

    async find(
        filter: FilterQuery<GiftExchangeDocument>,
    ): Promise<GiftExchangeDocument[]> {
        return await this.model.find(filter);
    }

    async findById(id: string | Types.ObjectId): Promise<GiftExchangeDocument> {
        return this.model.findById(id);
    }

    async findOne(
        filter: FilterQuery<GiftExchangeDocument>,
    ): Promise<GiftExchangeDocument> {
        return this.model.findOne(filter);
    }

    async create(
        data: Partial<GiftExchangeEntity>,
    ): Promise<GiftExchangeDocument> {
        return this.model.create(data);
    }

    async updateById(
        id: string | Types.ObjectId,
        update: UpdateQuery<GiftExchangeDocument>,
    ): Promise<GiftExchangeDocument> {
        return this.model.findByIdAndUpdate(id, update, { new: true });
    }

    async updateOne(
        filter: FilterQuery<GiftExchangeDocument>,
        update: UpdateQuery<GiftExchangeDocument>,
    ): Promise<GiftExchangeDocument> {
        return this.model.findOneAndUpdate(filter, update, { new: true });
    }

    async upsert(
        filter: FilterQuery<GiftExchangeDocument>,
        upsert: UpdateQuery<GiftExchangeDocument>,
    ): Promise<GiftExchangeDocument> {
        return this.model.findOneAndUpdate(filter, upsert, {
            new: true,
            upsert: true,
        });
    }

    async deleteById(id: string | Types.ObjectId) {
        return this.model.findByIdAndDelete(id);
    }

    async deleteOne(filter: FilterQuery<GiftExchangeDocument>) {
        return this.model.findOneAndDelete(filter);
    }
}

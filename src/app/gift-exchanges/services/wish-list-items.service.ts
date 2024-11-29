import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { COLLECTIONS } from '@app/gift-exchanges/constants';
import {
    WishListItemDocument,
    WishListItemEntity,
} from '@app/gift-exchanges/schemas';

@Injectable()
export class WishListItemsService {
    constructor(
        @InjectModel(COLLECTIONS.WishListItem)
        private readonly model: Model<WishListItemDocument>,
    ) {}

    async find(filter: FilterQuery<WishListItemDocument>) {
        return await this.model.find(filter);
    }

    async findById(id: string | Types.ObjectId) {
        return this.model.findById(id);
    }

    async findOne(filter: FilterQuery<WishListItemDocument>) {
        return this.model.findOne(filter);
    }

    async create(data: Partial<WishListItemEntity>) {
        return this.model.create(data);
    }

    async updateById(
        id: string | Types.ObjectId,
        update: UpdateQuery<WishListItemDocument>,
    ) {
        return this.model.findByIdAndUpdate(id, update, { new: true });
    }

    async updateOne(
        filter: FilterQuery<WishListItemDocument>,
        update: UpdateQuery<WishListItemDocument>,
    ) {
        return this.model.findOneAndUpdate(filter, update, { new: true });
    }

    async upsert(
        filter: FilterQuery<WishListItemDocument>,
        upsert: UpdateQuery<WishListItemDocument>,
    ) {
        return this.model.findOneAndUpdate(filter, upsert, {
            new: true,
            upsert: true,
        });
    }

    async deleteById(id: string | Types.ObjectId) {
        return this.model.findByIdAndDelete(id);
    }

    async deleteOne(filter: FilterQuery<WishListItemDocument>) {
        return this.model.findOneAndDelete(filter);
    }
}

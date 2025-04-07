import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { USERS_MODULE_COLLECTIONS } from '../constants';
import { UserEntity, UserDocument } from '../schemas';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(USERS_MODULE_COLLECTIONS.User)
        private model: Model<UserDocument>,
    ) {}

    async find(filter: FilterQuery<UserDocument>) {
        return await this.model.find(filter);
    }

    async findById(id: string | Types.ObjectId) {
        return this.model.findById(id);
    }

    async findOne(filter: FilterQuery<UserDocument>) {
        return this.model.findOne(filter);
    }

    async create(data: Partial<UserEntity>) {
        return this.model.create(data);
    }

    async findOrCreate(
        filter: FilterQuery<UserDocument>,
        data: Partial<UserEntity>,
    ) {
        const found = await this.findOne(filter);

        return found ?? this.model.create(data);
    }

    async updateById(
        id: string | Types.ObjectId,
        update: UpdateQuery<UserDocument>,
    ) {
        return this.model.findByIdAndUpdate(id, update, { new: true });
    }

    async updateOne(
        filter: FilterQuery<UserDocument>,
        update: UpdateQuery<UserDocument>,
    ) {
        return this.model.findOneAndUpdate(filter, update, { new: true });
    }

    async upsert(
        filter: FilterQuery<UserDocument>,
        upsert: UpdateQuery<UserDocument>,
    ) {
        return this.model.findOneAndUpdate(filter, upsert, {
            new: true,
            upsert: true,
        });
    }

    async deleteById(id: string | Types.ObjectId) {
        return this.model.findByIdAndDelete(id);
    }

    async deleteOne(filter: FilterQuery<UserDocument>) {
        return this.model.findOneAndDelete(filter);
    }
}

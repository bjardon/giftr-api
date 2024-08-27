import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId, UpdateQuery } from 'mongoose';
import { UserEntity, UserDocument } from '@app/users/schemas';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserEntity.name) private model: Model<UserDocument>,
    ) {}

    async find(filter: FilterQuery<UserDocument>) {
        return await this.model.find(filter);
    }

    async findById(id: string | ObjectId) {
        return this.model.findById(id);
    }

    async findOne(filter: FilterQuery<UserDocument>) {
        return this.model.findOne(filter);
    }

    async create(data: Partial<UserEntity>) {
        return this.model.create(data);
    }

    async updateById(id: string | ObjectId, update: UpdateQuery<UserDocument>) {
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

    async deleteById(id: string | ObjectId) {
        return this.model.findByIdAndDelete(id);
    }

    async deleteOne(filter: FilterQuery<UserDocument>) {
        return this.model.findOneAndDelete(filter);
    }
}

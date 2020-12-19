import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Box } from './interfaces/box.interface';
import { BoxClass } from './schemas/box.schema';

@Injectable()
export class BoxService {
  constructor(
    @InjectModel(BoxClass.name)
    private boxModel: Model<BoxClass>,
  ) {}

  async findAll(): Promise<Box[]> {
    return await this.boxModel.find().exec();
  }

  async findOne(id: string): Promise<Box> {
    return await this.boxModel.findOne({ _id: id });
  }

  async create(box: Box): Promise<Box> {
    const newBox = new this.boxModel(box);
    return await newBox.save();
  }

  async delete(id: string): Promise<Box> {
    return await this.boxModel.findByIdAndRemove(id);
  }

  async update(id: string, box: Box): Promise<Box> {
    return await this.boxModel.findByIdAndUpdate(id, box, {
      new: true,
    });
  }
}

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocType } from './interfaces/docType.interface';
import { DocTypes } from './schemas/docType.schema';

@Injectable()
export class DocTypeService {
  constructor(
    @InjectModel(DocTypes.name)
    private DocTypeModel: Model<DocTypes>,
  ) {}

  async findAll(): Promise<DocType[]> {
    return await this.DocTypeModel.find({ name: { "$ne": "" } ,isActive: true}).exec();
  }

  async findOne(id: string): Promise<DocType> {
    return await this.DocTypeModel.findOne({ _id: id });
  }

  async create(DocType: DocType): Promise<DocType> {
    const newDocType = new this.DocTypeModel(DocType);
    newDocType.isActive = true;
    return await newDocType.save();
  }

  async delete(id: string): Promise<DocType> {
    return await this.DocTypeModel.findByIdAndRemove(id);
  }

  async update(id: string, DocType: DocType): Promise<DocType> {
    return await this.DocTypeModel.findByIdAndUpdate(id, DocType, {
      new: true,
    });
  }
}

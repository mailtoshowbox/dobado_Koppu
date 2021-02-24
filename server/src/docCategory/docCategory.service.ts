import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocCategory } from './interfaces/docCategory.interface';
import { DocCategories } from './schemas/docCategory.schema';

@Injectable()
export class DocCategoryService {
  constructor(
    @InjectModel(DocCategories.name)
    private DocCategoryModel: Model<DocCategories>,
  ) {}

  async findAll(): Promise<DocCategory[]> {
    return await this.DocCategoryModel.find({ name: { "$ne": "" } ,isActive: true}).exec();
  }

  async findOne(id: string): Promise<DocCategory> {
    return await this.DocCategoryModel.findOne({ _id: id });
  }

  async create(DocCategory: DocCategory): Promise<DocCategory> {
    const newDocCategory = new this.DocCategoryModel(DocCategory);
    newDocCategory.isActive = true;
    return await newDocCategory.save();
  }

  async delete(id: string): Promise<DocCategory> {
    return await this.DocCategoryModel.findByIdAndRemove(id);
  }

  async update(id: string, DocCategory: DocCategory): Promise<DocCategory> { 
    return await this.DocCategoryModel.findByIdAndUpdate(id, DocCategory, {
      new: true,
    });
  }
}

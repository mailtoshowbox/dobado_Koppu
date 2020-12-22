import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from './interfaces/product.interface';
import { Documents } from './schemas/product.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Documents.name)
    private productModel: Model<Documents>,
  ) {}

  async findAll(): Promise<Document[]> {
    return await this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Document> {
    return await this.productModel.findOne({ _id: id });
  }

  async create(product: Document): Promise<Document> {
    const newProduct = new this.productModel(product);
    return await newProduct.save();
  }

  async delete(id: string): Promise<Document> {
    return await this.productModel.findByIdAndRemove(id);
  }

  async update(id: string, product: Document): Promise<Document> {
    return await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
  }
}

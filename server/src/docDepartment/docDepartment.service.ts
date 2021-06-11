import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocDepartment } from './interfaces/docDepartment.interface';
import { DocDepartments } from './schemas/docDepartment.schema';

@Injectable()
export class DocDepartmentService {
  constructor(
    @InjectModel(DocDepartments.name)
    private DocDepartmentModel: Model<DocDepartments>,
  ) {}

  async findAll(): Promise<DocDepartment[]> {
    return await this.DocDepartmentModel.find({ name: { "$ne": "" } ,isActive: true}).exec();
  }

  async findOne(id: string): Promise<DocDepartment> {
    return await this.DocDepartmentModel.findOne({ _id: id });
  }

  async create(DocDepartment: DocDepartment): Promise<DocDepartment> {
    const newDocDepartment = new this.DocDepartmentModel(DocDepartment);
    newDocDepartment.isActive = true;
    return await newDocDepartment.save();
  }

  async delete(id: string): Promise<DocDepartment> {
    return await this.DocDepartmentModel.findByIdAndRemove(id);
  }

  async update(id: string, DocDepartment: DocDepartment): Promise<DocDepartment> { 
    return await this.DocDepartmentModel.findByIdAndUpdate(id, DocDepartment, {
      new: true,
    });
  }
}

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocRequest } from './interfaces/docRequest.interface';
import { DocRequests } from './schemas/docRequest.schema';  
 
@Injectable()
export class DocRequestService {
  constructor(
    @InjectModel(DocRequests.name)
    private DocRequestModel: Model<DocRequests>,
   // @InjectModel(RequestedDocuments.name) private readonly requestedDocModal: Model<RequestedDocuments>,
  ) {}

  async findAll(): Promise<DocRequest[]> {
    return await this.DocRequestModel.find({}).exec();
  }

  async findAllAprove(): Promise<DocRequest[]> {
    console.log("sdfsdf");
    return await this.DocRequestModel.find({}).exec();
  }
  async findOne(id: string): Promise<DocRequest> {
    return await this.DocRequestModel.findOne({ _id: id });
  }

  

  async create(docRequest: DocRequest) { 
    console.log("docRequest----", docRequest);
    const newDocRequest = new this.DocRequestModel(docRequest);

    return await newDocRequest.save(); 
 
    }
    
  
 

  async delete(id: string): Promise<DocRequest> {
    return await this.DocRequestModel.findByIdAndRemove(id);
  }

  async update(id: string, DocRequest: DocRequest): Promise<DocRequest> { 
    return await this.DocRequestModel.findByIdAndUpdate(id, DocRequest, {
      new: true,
    });
  }
}

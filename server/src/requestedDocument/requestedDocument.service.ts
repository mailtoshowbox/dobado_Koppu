import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestedDocument } from './interfaces/requestedDocument.interface';
import { RequestedDocuments } from './schemas/requestedDocument.schema';



@Injectable()
export class RequestedDocumentService {
  constructor(
    @InjectModel(RequestedDocuments.name)
    private DocRequestModel: Model<RequestedDocuments>,
  //  @InjectModel(ReqDocument.name) private readonly requestDoc: Model<ReqDocument>,

  ) {}

  async findAll(): Promise<RequestedDocuments[]> {
    return await this.DocRequestModel.find({ name: { "$ne": "" } ,isActive: true}).exec();
  }

  async findOne(id: string): Promise<RequestedDocuments> {
    return await this.DocRequestModel.findOne({ _id: id });
  }

  async create(DocRequest: RequestedDocuments): Promise<RequestedDocuments> { 

    const newDocRequest = new this.DocRequestModel(DocRequest);

     
  return  await newDocRequest.save()
 
    /*   const newRequestDocument = new this.requestDoc({});

      newRequestDocument.document_name="Test";
      newRequestDocument.document_no="Test";
      
       newRequestDocument.save(); */
    

 
  }

  async delete(id: string): Promise<RequestedDocuments> {
    return await this.DocRequestModel.findByIdAndRemove(id);
  }

  async update(id: string, DocRequest: RequestedDocuments): Promise<RequestedDocuments> { 
    return await this.DocRequestModel.findByIdAndUpdate(id, DocRequest, {
      new: true,
    });
  }
}

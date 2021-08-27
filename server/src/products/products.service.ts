import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from './interfaces/product.interface';
import { Documents } from './schemas/product.schema';

import { Boxes } from './schemas/box.schema';
import { Racks } from './schemas/rack.schema';
import { DocType } from './schemas/docType.schema';
 
import  moment  from 'moment';

var QRCode = require('qrcode')

 
@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Documents.name)
    private productModel: Model<Documents>,
    @InjectModel(Boxes.name) private readonly boxModel: Model<Boxes>, 
    @InjectModel(Racks.name) private readonly rackModel: Model<Racks>) { }

  async findAll(mode, id=null): Promise<Document[]> {

    if(mode === 'issued'){
      console.log("id----", id);
      return await  this.productModel.find({ isActive: false, isRequestedDocument : true, "document_request_info.document_requested_by" :id }).then((res:any)=>{   
         return res;
      });
    }else if(mode === 'log-sheet'){
      return await  this.productModel.find({ isActive: false, isRequestedDocument : true }).then((res:any)=>{   
         return res;
      });
    }else{
      return await this.productModel.aggregate([
        { $match: { name: { "$ne": "" } , isActive :{ "$ne": false   }  },  },
        { $addFields: {
          converted_rack: {
              $convert: { 
                  input: "$rack",
                  to: "objectId",
                  onError: 0
              }
          },
          converted_category: {
            $convert: { 
                input: "$category",
                to: "objectId",
                onError: 0
            }
        },
        converted_box: {
          $convert: { 
              input: "$box",
              to: "objectId",
              onError: 0
          }
      },
      converted_doctype: {
        $convert: { 
            input: "$document_type",
            to: "objectId",
            onError: 0
        }
    }
      }},
     
      {
        $lookup:
        {
          from: "racks",
          localField: "converted_rack",
          foreignField: "_id",
          as: "rack_info"
        }
      },
      {
        $lookup:
        {
          from: "doccategories",
          localField: "converted_category",
          foreignField: "_id",
          as: "category_info"
        }
      },
      {
        $lookup:
        {
          from: "boxes",
          localField: "converted_box",
          foreignField: "_id",
          as: "box_info"
        }
      },
      {
        $lookup:
        {
          from: "doctypes",
          localField: "converted_doctype",
          foreignField: "_id",
          as: "docType_info"
        }
      }
      ])
    }
    
  } 

  async findAllDocuments()  {
    return await this.productModel.find().exec();
  }

  

  async getDashboardList(id: string) {
    return await this.productModel.findOne({ _id: id });
  }

  async findOne(id: string) {
    return await this.productModel.findOne({ _id: id });
  }

  async create(product: Document) { 
    const newProduct = new this.productModel(product); 
    newProduct.isActive = true;
    newProduct.isRequestedDocument = false;    
    return await newProduct.save();
  }

  async delete(id: string) {
    return await this.productModel.findByIdAndRemove(id);
  }

   async update(id: string, product: Document) {
    return await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
  } 

  async getQRCode(qrData) {
    return await this.runAsyncFunctions(qrData).then((result) => {
      let string = result.box + '/' + qrData.rack + '/' + qrData.name;
      return QRCode.toDataURL(string)
        .then(url => {
          return { qrImage: url };
        })
        .catch(err => {
          //reject(url)
        })
    });
  }

  async getRandomCode(dat) {
    console.log("TESTS");
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return await this.productModel.findOne({ 'qr_code': text }).then((retuh) => {
      if (retuh === null) {
        return { code: text };
      } else {
        this.getRandomCode({})
      }


    });


    /* }, function(err, result){
      if (err) callback(err);
      else if (result) return this.getNumber(callback);
      else return {text}
  }); */


  }



  async runAsyncFunctions(qrData) {
    const loopdat = [{ field: 'box' }, { field: 'rack' }]

    const resiluSet = qrData;
    return Promise.all(
      loopdat.map(async ({ field }, ind) => {
        if (field === 'box') {
          await this.boxModel.findOne({ _id: qrData.box }).then(({ name = "" }) => {
            resiluSet.box = name;
          }).catch((err) => {

          });
          ///  console.log(boxName)
        } else if (field === 'rack') {
          await this.rackModel.findOne({ _id: qrData.rack }).then(({ name = "" }) => {
            resiluSet.rack = name;
          }).catch((err) => {

          });
        }
      })
    ).then(() => {
      return resiluSet;
    })
  }



  
  async getLogSheet({startDate=new Date(), endDate=new Date()}): Promise<Document[]> {  
  //  var today = moment(startDate).format('YYYY-MM-DD[T00:00:00.000Z]');    
   // var tomorrow = moment(endDate).format('YYYY-MM-DD[T00:00:00.000Z]');
   // console.log("startDate----", new Date(startDate));
   // const m = moment(startDate).startOf('day').toDate();// moment(date).format('YYYY-MM-DD');   
   // console.log("m----", m);

   let date1 = new Date(new Date(startDate).setHours(0, 0, 0));
   let date2 = new Date(new Date(endDate).setHours(23, 59, 59));
   
      return await  this.productModel.find(
        {"document_request_info.document_issued_on": {
        $gte:date1,$lt: date2    } }).then((res:any)=>{   
         return res;
      });
    
    
  } 
}

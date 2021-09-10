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
      return await  this.productModel.find(
     // { isActive: false, isRequestedDocument : true, "document_request_info.document_requested_by" :id }
     {"$or": [{
      "isActive": false, "isRequestedDocument" : true, "document_request_info.document_requested_by" :id
  }, {
      "isActive": true, "is_requested_for_takeout" : true, "document_request_info.document_requested_by" :id
  }]}
        
        ).then((res:any)=>{   
         return res;
      });
    }else if(mode === 'takeOutRequest'){       
      return await  this.productModel.find({ isActive: true, document_no : id,  is_requested_for_takeout :{ "$ne": true   }  }).then((res:any)=>{   
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
    const  {is_requested_for_takeout_submit = false, is_requested_for_takeout_return = false,is_requested_for_takeout_return_approve=false } =product;
  
    console.log("is_requested_for_takeout_return_approve--", is_requested_for_takeout_return_approve);
  
    if(is_requested_for_takeout_submit){
      return await this.productModel
      .find({ isActive: true, _id: id })
      .then((res: any) => {
        let documenttoEdit = res[0];
        const {
          takeout_requested_details: {
            takeout_request_details_list = [],
            current_status : {request_no=null} = {}
          } = {},
          takeout_requested_details = {},
        } = documenttoEdit;
        takeout_request_details_list.forEach((list) => {
          if (request_no && list.doc_request_no === request_no) {            									
                list.doc_submitted_by = "XX";										
                list.doc_submitted_on = new Date();   
                list.takeout_return_date =product.takeout_return_date;      
          }         
        });
        let requestDetails = takeout_requested_details;
          requestDetails = {
            current_status: {
              ...requestDetails.current_status,
              code: "submitted",
              label: "Submitted"
            },
            takeout_request_details_list: takeout_request_details_list,
          };

        documenttoEdit._doc = {
          ...documenttoEdit._doc,
          takeout_requested_details: { ...requestDetails },
        };

        return this.productModel
          .findByIdAndUpdate(id, documenttoEdit, {
            new: true,
          })
          .then((tre) => {});
      });


      /* return await this.productModel.findByIdAndUpdate(id, product, {
        new: true,
      }); */
    }else if(is_requested_for_takeout_return){
      return await this.productModel
      .find({ isActive: true, _id: id })
      .then((res: any) => {
        let documenttoEdit = res[0];
        const {
          takeout_requested_details: {
            takeout_request_details_list = [],
            current_status : {request_no=null} = {}
          } = {},
          takeout_requested_details = {},
        } = documenttoEdit;
        takeout_request_details_list.forEach((list) => {
          if (request_no && list.doc_request_no === request_no) {            									
                list.returned_by = "XX";										
                list.returned_on = new Date();            
          }         
        });
        let requestDetails = takeout_requested_details;
          requestDetails = {
            current_status: {
              ...requestDetails.current_status,
              code: "returned",
              label: "Returned",
            },
            takeout_request_details_list: takeout_request_details_list,
          };

        documenttoEdit._doc = {
          ...documenttoEdit._doc,
          takeout_requested_details: { ...requestDetails },
        };

        return this.productModel
          .findByIdAndUpdate(id, documenttoEdit, {
            new: true,
          })
          .then((tre) => {});
      });
    }else if(is_requested_for_takeout_return_approve){
      return await this.productModel
      .find({ isActive: true, _id: id })
      .then((res: any) => {
        let documenttoEdit = res[0];
        const {
          takeout_requested_details: {
            takeout_request_details_list = [],
            current_status : {request_no=null} = {}
          } = {},
          takeout_requested_details = {},
        } = documenttoEdit;
        takeout_request_details_list.forEach((list) => {
          if (request_no && list.doc_request_no === request_no) {            									
                list.return_approved_by = "XX";										
                list.returned_approved_on = new Date();            
          }         
        });
        let requestDetails = takeout_requested_details;
          requestDetails = {
            current_status: {
              ...requestDetails.current_status,
              code: "return_approved",
              label: "Return Approved",
            },
            takeout_request_details_list: takeout_request_details_list,
          };
          const reset_document = {  is_requested_for_takeout:  false,
            takeout_return_date : null};

        documenttoEdit._doc = {
          ...documenttoEdit._doc,
          ...reset_document,
          takeout_requested_details: { ...requestDetails },
        };

        return this.productModel
          .findByIdAndUpdate(id, documenttoEdit, {
            new: true,
          })
          .then((tre) => {console.log("tre", tre);});
      });
    }else{
      return await this.productModel.findByIdAndUpdate(id, product, {
        new: true,
      });
    }
   
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
    console.log("TESTS", dat);
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

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocRequest } from './interfaces/docRequest.interface';
import { DocApprovalHistory } from './interfaces/docApprovalHistoryinterface ';

import { DocRequests } from './schemas/docRequest.schema';   
import { DocApprovalHistories } from './schemas/docApprovalHistory.schema';

 
@Injectable()
export class DocRequestService {
  constructor(
    @InjectModel(DocRequests.name)
    private DocRequestModel: Model<DocRequests>, 
    @InjectModel(DocApprovalHistories.name) private readonly docApprovalHistModel:Model<DocApprovalHistories>
   // @InjectModel(RequestedDocuments.name) private readonly requestedDocModal: Model<RequestedDocuments>,
  ) {}

  async findAll(mode : string, empl_id: string): Promise<DocRequest[]> {
    console.log("string----",mode);    
    if(mode === 'approval'){       
      return await   this.DocRequestModel.find({}).exec().then((resultNew)=>{
        let approval_list_for_epl : any = [];    
        if(resultNew.length > 0){         
          resultNew.forEach((req)=>{
            let checkAppor : any    = [];
            let approvalList : any    = req.approval;
             if(approvalList.length ){ 
                checkAppor     =  approvalList.filter(approv => { 
                return approv.empl_id === empl_id && approv.status === 'pending';
              }) || [];             
              if(checkAppor.length > 0){               
                approval_list_for_epl.push(req);
              } 
            }
          })          
          return approval_list_for_epl;
        }else{
          return [];
        }
      
      });
    }else if(mode === 'issuance'){
      return await   this.DocRequestModel.find({}).exec().then((resultNew)=>{
        let approval_list_for_epl : any = [];    
        if(resultNew.length > 0){         
          resultNew.forEach((req)=>{
            let checkAppor : any    = [];
            let approvalList : any    = req.approval;
            if(approvalList.length > 0){ 
              checkAppor     =  approvalList.filter(approv => { 
                return  approv.status === 'approved';
              }) || [];     

              if(checkAppor.length === approvalList.length){               
                approval_list_for_epl.push(req);
              }
            }
          })          
          return approval_list_for_epl;
        }else{
          return [];
        }
      
      });
    
    }else{
      return await   this.DocRequestModel.find({}).exec().then((resultNew)=>{
        let approval_list_for_epl : any = [];    
        if(resultNew.length > 0){         
          resultNew.forEach((req)=>{
            let checkAppor : any    = [];
            let approvalList : any    = req.approval;
             if(approvalList.length > 0){ 
                checkAppor     =  approvalList.filter(approv => { 
                return  approv.status !== 'pending';
              }) || [];             
              if(checkAppor.length === 0){               
                approval_list_for_epl.push(req);
              } 
            }
          })          
          return approval_list_for_epl;
        }else{
          return [];
        }
      
      });
    
    }
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
    async checkInitialHistory(docApprovalHistory: DocApprovalHistory) { 
      return await this.docApprovalHistModel.findOne({ mode_of_access: 'initial', request_no : docApprovalHistory.request_no });
    }
    async createInitialHistory(docApprovalHistory: DocApprovalHistory) { 
      const newDocapprovalHistory = new this.docApprovalHistModel(docApprovalHistory);
          return  newDocapprovalHistory.save();
    }
    async checkRecentHistory(docApprovalHistory: DocApprovalHistory) { 
      return await this.docApprovalHistModel.findOne({ mode_of_access: 'recent', request_no : docApprovalHistory.request_no });
    }
    async createRecentHistory(docApprovalHistory: DocApprovalHistory) { 
      docApprovalHistory.mode_of_access = 'recent';
      const newDocapprovalHistory = new this.docApprovalHistModel(docApprovalHistory);
          return  newDocapprovalHistory.save();
    }


    async updateRecentHistory(docApprovalHistory: DocApprovalHistory, temp) { 
          this.docApprovalHistModel.findByIdAndUpdate(temp, docApprovalHistory);
    }
    
    

    
    async createApprovalHistory(docApprovalHistory: DocApprovalHistory) { 
      return await this.docApprovalHistModel.findOne({ mode_of_access: 'initial', request_no : docApprovalHistory.request_no });
        
        /* console.log("initialData----", initialData);
        if(Object.keys(initialData).length > 0){
           this.docApprovalHistModel.findOne({ mode_of_access: 'recent', request_no : docApprovalHistory.request_no }).then((recentData)=>{
            console.log("recentData----", recentData);
            if(Object.keys(recentData).length > 0){
                this.docApprovalHistModel.findByIdAndUpdate(recentData._id, docApprovalHistory);
            }else{
              docApprovalHistory.mode_of_access ="recent";
              const newDocRequest = new this.docApprovalHistModel(docApprovalHistory);
              return  newDocRequest.save(); 
            }
          });

        } */
 
       // if(Object.keys(data).length > 0){
       /*    console.log("dasdasdasdasd");
           this.docApprovalHistModel.findOne({ mode_of_access: 'recent', request_no : docApprovalHistory.request_no }).then((recentData)=>{
            console.log("recentData----", recentData);
            if(Object.keys(recentData).length > 0){
                this.docApprovalHistModel.findByIdAndUpdate(recentData._id, docApprovalHistory);
            }else{
              docApprovalHistory.mode_of_access ="recent";
              const newDocRequest = new this.docApprovalHistModel(docApprovalHistory);
              return  newDocRequest.save(); 
            }
          });  */     
          
     //   }else{
         /*  console.log("dasdasdasdasd");
          const newDocRequest = new this.docApprovalHistModel(docApprovalHistory);
          return  newDocRequest.save();  */
     //   }        return {};
     // }); 
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

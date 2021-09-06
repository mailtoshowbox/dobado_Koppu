import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocRequest } from './interfaces/docRequest.interface';
import { DocApprovalHistory } from './interfaces/docApprovalHistoryinterface ';

import { DocRequests } from './schemas/docRequest.schema';   
import { DocApprovalHistories } from './schemas/docApprovalHistory.schema';
import { Documents } from '../products/schemas/product.schema';

 
@Injectable()
export class DocRequestService {
  constructor(
    @InjectModel(DocRequests.name)
    private DocRequestModel: Model<DocRequests>, 
    @InjectModel(DocApprovalHistories.name) private readonly docApprovalHistModel:Model<DocApprovalHistories>,
    @InjectModel(Documents.name) private readonly documentModal:Model<Documents>
   // @InjectModel(RequestedDocuments.name) private readonly requestedDocModal: Model<RequestedDocuments>,
  ) {}

  async findAll(mode : string, empl_id: string): Promise<DocRequest[]> {
    if(mode === 'approval'){       
      return await   this.DocRequestModel.find({}).exec().then((resultNew)=>{
        let approval_list_for_epl : any = [];    
        if(resultNew.length > 0){         
          resultNew.forEach((req)=>{
            let checkAppor : any    = [];
            let approvalList : any    = req.approval;
             if(approvalList.length ){ 
                checkAppor     =  approvalList.filter(approv => { 
                return approv.empl_id === empl_id && approv.status !== 'approved';
              }) || [];             
              if(checkAppor.length > 0){               
                approval_list_for_epl.push(req);
              } 
            }
          }); 
                   
         return approval_list_for_epl;
        }else{
          return [];
        }
      
      });
    }else if(mode === 'takeoutissuance'){ 
      return await   this.DocRequestModel.find({"doc_issuance_status.is_issued" : { $ne: true }, "doc_requested_doctype.id" : '6' }).exec().then((resultNew)=>{
        let approval_list_for_epl : any = [];  
        let employee_verified = false;  
        if(resultNew.length > 0){         
          resultNew.forEach((req)=>{
            let checkAppor : any    = [];
            let approvalList : any    = req.approval;
            if(approvalList.length > 0 ){ 
              checkAppor     =  approvalList.filter(approv => { 
                
                if(!employee_verified){
                  employee_verified =  empl_id.toString() === approv.empl_id.toString();
                }
                return  approv.status === 'approved';
              }) || [];     

              if(checkAppor.length === approvalList.length && employee_verified){               
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
      return await   this.DocRequestModel.find({"doc_issuance_status.is_issued" : { $ne: true }, "doc_requested_doctype.id" : { $ne: '6' }, }).exec().then((resultNew)=>{
        let approval_list_for_epl : any = [];  
        let employee_verified = false;  
        if(resultNew.length > 0){         
          resultNew.forEach((req)=>{
            let checkAppor : any    = [];
            let approvalList : any    = req.approval;
            if(approvalList.length > 0 ){ 
              checkAppor     =  approvalList.filter(approv => { 
                
                if(!employee_verified){
                  employee_verified =  empl_id.toString() === approv.empl_id.toString();
                }
                return  approv.status === 'approved';
              }) || [];     

              if(checkAppor.length === approvalList.length && employee_verified){               
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
      const wr = empl_id !== '0' ? { empl_id } : {};
      return await   this.DocRequestModel.find(wr).exec().then((resultNew)=>{
        let approval_list_for_epl : any = [];    
        if(resultNew.length > 0){         
          resultNew.forEach((req)=>{
            let checkAppor : any    = [];
            let approvalList : any    = req.approval;
             if(approvalList.length > 0){ 
                checkAppor     =  approvalList.filter(approv => { 
                return  approv.status === 'pending' || approv.status === 'rejected' || approv.status === 'approved';
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
    
    }
  }

  async findAllAprove(): Promise<DocRequest[]> { 
    return await this.DocRequestModel.find({}).exec();
  }
  async findOne(id: string): Promise<DocRequest> {
    return await this.DocRequestModel.findOne({ _id: id });
  }

  

  async create(docRequest: DocRequest) {  
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


    async createDocRequestApprovalHistory(docApprovalHistory: DocApprovalHistory) {      
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

   

  async update(id: string, DocRequest: DocRequest, page:string): Promise<DocRequest> {  

    if(page === "issueGenaralIssuance"){ 
      const {requested_doc=[], issuance:{doc_issued_by=[]}, doc_requested_department={}} =DocRequest; 
      
     // let selectedDocument:any = [];
      requested_doc.map((doc : any)=>{   
        if(doc.is_doc_approved && !doc.is_doc_issued){  
          
          console.log("doc.doc_requested_department---", doc_requested_department);

        const doc_issuer =   doc_issued_by.find((element) =>  element.document_id === doc.document_no) ;

          doc.is_doc_issued = true;
         const documentList  = doc.doc_issuance ? doc.doc_issuance : [];
        
          if(documentList.length > 0){
            documentList.forEach((doc)=>{
              const newDcoument = {  
                name: doc.document_name,
                description: doc.document_name,
                no_of_copy : doc.no_of_copy,
                no_of_page : doc.no_of_page,
                document_no : doc.document_no,
                qr_code : doc.document_no,
                box: '',
                rack:  '',
                category :  "",
                box_info: [],
                rack_info: [],
                category_info: [],
                document_type : "",
                docType_info: "",
                is_Active: true,
                retension_time : "",
                document_request_info : { 
                  document_request_no: DocRequest.request_no,
                  document_issued_on : new Date(),
                  document_issued_by : doc_issuer.document_issued_by,
                  document_requested_by : DocRequest.empl_id ,
                  document_issued_to : DocRequest.empl_id,
                  document_request_department : DocRequest.doc_requested_department,
                  document_request_doc_type : DocRequest.doc_requested_doctype
                }             
              
              }; 
              console.log("DocRequest---", DocRequest);
              console.log("newDcoument---", newDcoument);
              const newProduct = new this.documentModal(newDcoument); 
              newProduct.isActive = false;
              newProduct.isRequestedDocument = true; 
            
              newProduct.save().then((res)=>{
                console.log("+++++++++INsert DONE=");
              });
            }) 
          }
        }        
        return doc 
      });
     /*  let documentList = [];
      if(selectedDocument.length === 1){
         documentList  = selectedDocument[0].doc_issuance ? selectedDocument[0].doc_issuance : [];
      }else if(selectedDocument.length > 1) {
         documentList  = selectedDocument.doc_issuance ? selectedDocument.doc_issuance : [];
      }
    

     console.log("documentList---", documentList);
      if(documentList.length > 0){
        documentList.forEach((doc)=>{
          const newDcoument = {  
            name: doc.document_name,
            description: doc.document_name,
            no_of_copy : doc.no_of_copy,
            no_of_page : doc.no_of_page,
            document_no : doc.document_no,
            qr_code : doc.document_no,
            box: '',
            rack:  '',
            category :  "",
            box_info: [],
            rack_info: [],
            category_info: [],
            document_type : "",
            docType_info: "",
            is_Active: true,
            retension_time : "" }; 
          const newProduct = new this.documentModal(newDcoument); 
          newProduct.isActive = false;
          newProduct.isRequestedDocument = true;
          console.log("Insert");
          newProduct.save().then((res)=>{
            console.log("+++++++++INsert DONE=");
          });
        }) 
      }else{
         console.log("ALPHA");
      } */


      


     /*  if(issuanceList.length === requested_doc.length){
          issuanceList.forEach((doc)=>{

            const newDcoument = {  
              name: doc.document_name,
              description: doc.document_name,
              no_of_copy : doc.no_of_copy,
              no_of_page : doc.no_of_page,
              document_no : doc.document_no,
              box: '',
              rack:  '',
              category :  "",
              box_info: [],
              rack_info: [],
              category_info: [],
              document_type : "",
              docType_info: "",
              retension_time : "" };
              console.log("Partially newDcoument>>>", newDcoument);
            const newProduct = new this.documentModal(newDcoument); 
            newProduct.isActive = false;
            newProduct.isRequestedDocument = true;
            
            newProduct.save().then((res)=>{
              console.log("THENEN=", res);
            });
  
          })
      }else{

        console.log("issuanceList[0]-----", issuanceList[0]);

      const  {doc_issuance = [], document_no=''} =issuanceList[0] ? issuanceList[0] :[];
      if(document_no !== ""){
        requested_doc.map((doc : any)=>{   
          if(doc.document_no === document_no){
            doc.is_doc_issued = true;
          }          
          return doc 
        });  
        doc_issuance.forEach((doc)=>{
          console.log("Partially doc-------", doc.document_no);
          const newDcoument = {  
            name: doc.document_name,
            description: doc.document_name,
            no_of_copy : doc.no_of_copy,
            no_of_page : doc.no_of_page,
            document_no : doc.document_no,
            qr_code : doc.document_no,
            box: '',
            rack:  '',
            category :  "",
            box_info: [],
            rack_info: [],
            category_info: [],
            document_type : "",
            docType_info: "",
            is_Active: true,
            retension_time : "" }; 
          const newProduct = new this.documentModal(newDcoument); 
          newProduct.isActive = false;
          newProduct.isRequestedDocument = true;
          newProduct.save().then((res)=>{
          //  console.log("THENEN=", res);
          });

        })
      }
      } */
    } 
     return await this.DocRequestModel.findByIdAndUpdate(id, DocRequest, {
      new: true,
    }); 
  }
}

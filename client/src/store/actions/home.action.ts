
export const LIST_DOCCATEGORY: string = "LIST_DOCCATEGORY";
export const LIST_DOCTYPE: string = "LIST_DOCTYPE";
export const LIST_DOC: string = "LIST_DOC";
export const LIST_BOX: string = "LIST_BOX";

    export function updateListofDocCategory(items : any) {    
        let counter : any ={docCategories:0};
        if(items.data.length > 0){
            counter["docCategories"] = items.data.length ;
        } 
        return { type: LIST_DOCCATEGORY , ...counter };      
    }
    export function updateListofDocType(items : any) {   
        let counter : any ={docType:0};
        if(items.data.length > 0){
            counter["docType"] = items.data.length ;
        } 
        return { type: LIST_DOCCATEGORY ,  ...counter  };      
    }
    export function updateListofDocuemnts(items : any) {  
        
        const {box = {}, documents={  }} = items;
        let counter : any ={ box:0, totalDocuments : 0, nApprovedDocuments : 0, approvedDocuments:0};
        if(box.data.length > 0){
            counter["box"] = box.data.length ;
        }
        if(documents.data.length > 0){
            counter["totalDocuments"] = documents.data.length ;
            const nApprovedDocuments = documents.data.filter((pr :any) => !pr.document_info.status);
            const approvedDocuments = documents.data.filter((pr :any) => pr.document_info.status); 
            
            counter["nApprovedDocuments"] = nApprovedDocuments ;
            counter["approvedDocuments"] = approvedDocuments ;
        }
 ;
        return { type: LIST_DOC , ...counter };      
    }
    export function updateListofBoxes(items : any) {   
        let counter : any ={boxes:0};
        if(items.data.length > 0){
            counter["boxes"] = items.data.length ;
        } 
        return { type: LIST_BOX , ...counter };      
    }
 

 
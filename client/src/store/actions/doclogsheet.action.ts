//import { IDocLogSheet } from "../models/doclogsheet.interface";

import { IProduct, ProductModificationStatus } from "../models/product.interface";

 
export const LOAD_DOCUMENT_LOG_SHEET: string = "LOAD_DOCUMENT_LOG_SHEET";




    export function loadDocumentLogSheet(items : IProductList) { 
  
            return { type: LOAD_DOCUMENT_LOG_SHEET , docDestructList:  items  };
        
       
    
        }
  
interface IProductList extends Array<IProduct>{}
 
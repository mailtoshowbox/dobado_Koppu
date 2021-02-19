export interface Document {
    id?: string;
    name: string;
    description: string;
    box: string;
    rack: string;
    category: string;
    box_info: [Info];
    rack_info: [Info];
    category_info: [Info];
    document_type: string;
    docType_info: [Info];
    retension_time: any;
    isActive: boolean;
}
interface Info {
    id: string;
    name: string;
}
interface Info {
    id: string;
    name: string;
}
export {};

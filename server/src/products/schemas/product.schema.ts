import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export class CDocument extends Document {
	@Prop()
	isActive: Boolean;
}

export class DocumentInfo extends Document {
	@Prop()
	isActive: Boolean;
	@Prop()
	status: String;
	@Prop()
	createdOn: Date;
	@Prop()
	approvedOn: Date;
}
export class Retenstion extends Document {
	@Prop()
	time: Number;
	@Prop()
	defaultYear: Number;
	@Prop()
	calculateNonPerceptualTime: String;
	@Prop()
	status: String;
	@Prop()
	destructed_on: Date;
}
export class DocumentRequestInfo extends Document {
	@Prop()
	document_request_no: string;

	@Prop()
	document_issued_on: Date;

	@Prop()
	document_issued_by: string;

	@Prop()
	document_requested_by: string;
	
	@Prop()
	document_issued_from: string;

	@Prop()
	document_request_approved: [];
	
}
export class TakeoutInfo extends Document {
	@Prop()
	doc_request_no: string;
	@Prop()
	requested_by: string;
	@Prop()
	requested_on: Date;
	@Prop()
	approved_by: string;
	@Prop()
	approved_on: Date;
}
export class Info extends Document {
	@Prop()
	id: string;
	@Prop()
	name: string;
}

export class TakeoutRequestStatus extends Document {
	@Prop()
	code: string;
	@Prop()
	label: string;
	@Prop()
	request_no: string;
}
export class TakeoutRequestInfo extends Document {
	@Prop()
	current_status: TakeoutRequestStatus;

	@Prop()
	takeout_request_details_list: TakeoutInfo[];
}
@Schema()
export class Documents extends Document {
	@Prop()
	name: string;

	@Prop()
	qty: number;

	@Prop()
	description: string;

	@Prop()
	box: string;

	@Prop()
	rack: string;

	@Prop()
	category: string;

	@Prop()
	qr_code: string;

	@Prop()
	manufacturedate: Date;

	@Prop()
	expiredate: Date;

	@Prop()
	type_of_space: string;

	@Prop()
	document_info: DocumentInfo;

	@Prop()
	document_type: string;

	@Prop()
	retension_time: Retenstion;

	@Prop()
	isActive: boolean;

	@Prop()
	isRequestedDocument: boolean;

	@Prop()
	document_no: string;

	@Prop()
	no_of_copy: number;

	@Prop()
	no_of_page: number;

	@Prop()
	reason_for_request: string;	

	@Prop()
	document_request_info: DocumentRequestInfo;

	@Prop()
	is_requested_for_takeout: boolean;

	@Prop()
	takeout_requested_details: TakeoutRequestInfo;

	@Prop()
	takeout_return_date: Date;

	@Prop()
	document_type_details: Info;

	@Prop()
	document_category_details: Info;

	@Prop()
	document_rack_details: Info;

	@Prop()
	document_box_details: Info;

	
	@Prop()
	docStatus: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Documents);

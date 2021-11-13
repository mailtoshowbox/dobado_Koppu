import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DocRequest } from "./interfaces/docRequest.interface";
import { DocApprovalHistory } from "./interfaces/docApprovalHistoryinterface ";

import { DocRequests } from "./schemas/docRequest.schema";
import { DocApprovalHistories } from "./schemas/docApprovalHistory.schema";
import { Documents } from "../products/schemas/product.schema";

@Injectable()
export class DocRequestService {
	constructor(
		@InjectModel(DocRequests.name)
		private DocRequestModel: Model<DocRequests>,
		@InjectModel(DocApprovalHistories.name)
		private readonly docApprovalHistModel: Model<DocApprovalHistories>,
		@InjectModel(Documents.name)
		private readonly documentModal: Model<Documents> // @InjectModel(RequestedDocuments.name) private readonly requestedDocModal: Model<RequestedDocuments>,
	) { }

	async findAll(mode: string, empl_id: string): Promise<DocRequest[]> {
		if (mode === "approval") {
			return await this.DocRequestModel.find({})
				.exec()
				.then((resultNew) => {
					let approval_list_for_epl: any = [];
					if (resultNew.length > 0) {
						resultNew.forEach((req) => {
							let checkAppor: any = [];
							let approvalList: any = req.approval;
							if (approvalList.length) {
								checkAppor =
									approvalList.filter((approv) => {
										return (
											approv.empl_id === empl_id && approv.status !== "approved"
										);
									}) || [];
								if (checkAppor.length > 0) {
									approval_list_for_epl.push(req);
								}
							}
						});

						return approval_list_for_epl;
					} else {
						return [];
					}
				});
		} else if (mode === "takeoutissuance") {
			return await this.DocRequestModel.find({
				"issuance.is_issued": { $ne: true },
				"doc_requested_doctype.id": "6",
			})
				.exec()
				.then((resultNew) => {
					let approval_list_for_epl: any = [];
					let employee_verified = false;
					if (resultNew.length > 0) {
						resultNew.forEach((req) => {
							let checkAppor: any = [];
							let approvalList: any = req.approval;
							if (approvalList.length > 0) {
								checkAppor =
									approvalList.filter((approv) => {
										if (!employee_verified) {
											employee_verified =
												empl_id.toString() === approv.empl_id.toString();
										}
										return approv.status === "approved";
									}) || [];

								if (
									checkAppor.length === approvalList.length &&
									employee_verified
								) {
									approval_list_for_epl.push(req);
								}
							}
						});
						return approval_list_for_epl;
					} else {
						return [];
					}
				});
		} else if (mode === "issuance") {
			return await this.DocRequestModel.find({
				"doc_issuance_status.is_issued": { $ne: true },
				"doc_requested_doctype.id": { $ne: "6" },
			})
				.exec()
				.then((resultNew) => {
					let approval_list_for_epl: any = [];
					let employee_verified = false;
					if (resultNew.length > 0) {
						resultNew.forEach((req) => {
							let checkAppor: any = [];
							let approvalList: any = req.approval;
							if (approvalList.length > 0) {
								checkAppor =
									approvalList.filter((approv) => {
										if (!employee_verified) {
											employee_verified =
												empl_id.toString() === approv.empl_id.toString();
										}
										return approv.status === "approved";
									}) || [];

								if (
									checkAppor.length === approvalList.length &&
									employee_verified
								) {
									approval_list_for_epl.push(req);
								}
							}
						});
						return approval_list_for_epl;
					} else {
						return [];
					}
				});
		} else {
			const wr = empl_id !== "0" ? { empl_id } : {};
			return await this.DocRequestModel.find(wr)
				.exec()
				.then((resultNew) => {
					let approval_list_for_epl: any = [];
					if (resultNew.length > 0) {
						resultNew.forEach((req) => {
							let checkAppor: any = [];
							let approvalList: any = req.approval;
							if (approvalList.length > 0) {
								checkAppor =
									approvalList.filter((approv) => {
										return (
											approv.status === "pending" ||
											approv.status === "rejected" ||
											approv.status === "approved"
										);
									}) || [];
								if (checkAppor.length > 0) {
									approval_list_for_epl.push(req);
								}
							}
						});
						return approval_list_for_epl;
					} else {
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

		const { requested_doc = [], doc_type = "1" } = docRequest;

		if (doc_type === "6") {
			requested_doc.forEach((doc: any) => {
				if (doc._id !== "") {
					this.documentModal
						.find({ isActive: true, _id: doc._id })
						.then((res: any) => {
							//    console.log("res---", res);
							let documenttoEdit = res[0];

							const takeout_request_detail = {
								doc_request_no: docRequest.request_no,
								requested_by: docRequest.empl_id,
								requested_on: new Date(),
							};
							let takeout_request_details_list = [];
							if (
								documenttoEdit.takeout_requested_details &&
								documenttoEdit.takeout_requested_details
									.takeout_request_details_list
							) {
								takeout_request_details_list =
									documenttoEdit.takeout_requested_details
										.takeout_request_details_list;
							}
							takeout_request_details_list.push(takeout_request_detail);

							let requestDetails = {
								takeout_requested_details: {
									current_status: { code: "requested", label: "Requested", request_no: docRequest.request_no },
									takeout_request_details_list: takeout_request_details_list,
								},
								is_requested_for_takeout: true,
							};
							documenttoEdit._doc = {
								...documenttoEdit._doc,
								...requestDetails,
							};
							return this.documentModal
								.findByIdAndUpdate(
									doc._id,
									{ ...documenttoEdit },
									{
										new: true,
									}
								)
								.then((tre) => {
									console.log("tretre---", tre);
								});
						});
				}
			});
		}

		return await newDocRequest.save();
	}
	async checkInitialHistory(docApprovalHistory: DocApprovalHistory) {
		return await this.docApprovalHistModel.findOne({
			mode_of_access: "initial",
			request_no: docApprovalHistory.request_no,
		});
	}
	async createInitialHistory(docApprovalHistory: DocApprovalHistory) {
		const newDocapprovalHistory = new this.docApprovalHistModel(
			docApprovalHistory
		);
		return newDocapprovalHistory.save();
	}
	async checkRecentHistory(docApprovalHistory: DocApprovalHistory) {
		return await this.docApprovalHistModel.findOne({
			mode_of_access: "recent",
			request_no: docApprovalHistory.request_no,
		});
	}
	async createRecentHistory(docApprovalHistory: DocApprovalHistory) {
		docApprovalHistory.mode_of_access = "recent";
		const newDocapprovalHistory = new this.docApprovalHistModel(
			docApprovalHistory
		);
		return newDocapprovalHistory.save();
	}

	async createDocRequestApprovalHistory(
		docApprovalHistory: DocApprovalHistory
	) {
		const newDocapprovalHistory = new this.docApprovalHistModel(
			docApprovalHistory
		);
		return newDocapprovalHistory.save();
	}

	async updateRecentHistory(docApprovalHistory: DocApprovalHistory, temp) {
		this.docApprovalHistModel.findByIdAndUpdate(temp, docApprovalHistory);
	}

	async createApprovalHistory(docApprovalHistory: DocApprovalHistory) {
		return await this.docApprovalHistModel.findOne({
			mode_of_access: "initial",
			request_no: docApprovalHistory.request_no,
		});
	}
	async delete(id: string): Promise<DocRequest> {
		return await this.DocRequestModel.findByIdAndRemove(id);
	}

	async update(
		id: string,
		DocRequest: DocRequest,
		page: string,
		updateBy: string
	): Promise<DocRequest> {
		const {
			doc_type = "0",
			requested_doc = [],
			request_no = "",
			empl_id = "0", 
		} = DocRequest;


		if (doc_type === "6") { 
			requested_doc.forEach((doc: any) => {
				if (doc._id !== "") {
					const {takeout_return_date=""} = doc;

					console.log("doc---", doc);
					console.log("takeout_return_date---", takeout_return_date);
					this.documentModal
						.find({ isActive: true, _id: doc._id })
						.then((res: any) => {
							let documenttoEdit = res[0];
							const {
								takeout_requested_details: {
									takeout_request_details_list = [],
								} = {},
								takeout_requested_details = {},
							} = documenttoEdit;
							takeout_request_details_list.forEach((list) => {
								if (list.doc_request_no === request_no) {

									if (page === 'issueGenaralIssuance') {
										list.issued_by = updateBy;
										list.issued_on = new Date();
									} else {


										if (list.approved_by_1) {
											list.approved_by_2 = updateBy;
										} else {
											list.approved_by_1 = updateBy;
										}
										if (list.approved_on_1) {
											list.approved_on_2 = new Date();
										} else {
											list.approved_on_1 = new Date();
										}
									}
								}
							});

							let requestDetails = takeout_requested_details;
							if (page === 'issueGenaralIssuance') { // Issue Call
								requestDetails = {
									current_status: {
										...requestDetails.current_status,
										takeout_return_date : takeout_return_date,
										code: "issued",
										label: "Issued",
										request_no: request_no
									},
									takeout_request_details_list: takeout_request_details_list,
								};
							} else { // Approved Call
								requestDetails = {
									current_status: {
										...requestDetails.current_status,
										code: "approved",
										label: "Approved",
									},
									takeout_request_details_list: takeout_request_details_list,
								};
							}


							// console.log("requestDetails---", requestDetails);

							documenttoEdit._doc = {
								...documenttoEdit._doc,
								takeout_requested_details: { ...requestDetails },
							};

							return this.documentModal
								.findByIdAndUpdate(doc._id, documenttoEdit, {
									new: true,
								})
								.then((tre) => { });
						});
				}
			});
		} else {
			if (page === "issueGenaralIssuance") {
				const {
					requested_on="",
					requested_doc = [],
					doc_type = "0",
					issuance: { doc_issued_by = [] },
					doc_requested_department = {},
					approval =[]
				} = DocRequest; 
				requested_doc.map((doc: any) => {
					if (doc.is_doc_approved && !doc.is_doc_issued) {
						const doc_issuer = doc_issued_by.find(
							(element) => element.document_id === doc.document_no
						);


						doc.is_doc_issued = true;
						const documentList = doc.doc_issuance ? doc.doc_issuance : [];
						const { document_no = "" } = doc;
						if (documentList.length > 0) {
							documentList.forEach((doc) => {
								const newDcoument = {
									name: doc.document_name,
									description: doc.document_name,
									no_of_copy: doc.no_of_copy,
									no_of_page: doc.no_of_page,
									document_no: doc.document_no,
									qr_code: doc.document_no,
									reason_for_request : doc.reason_for_request,
									box: "",
									rack: "",
									category: "",
									box_info: [],
									rack_info: [],
									category_info: [],
									document_type: "",
									docType_info: "",
									is_Active: true,
									retension_time: "",
									document_request_info: {
										document_requested_on : requested_on,
										document_request_approved: approval,
										document_issued_from: document_no,
										document_request_no: DocRequest.request_no,
										document_issued_on: new Date(),
										document_issued_by: doc_issuer.document_issued_by,
										document_requested_by: DocRequest.empl_id,
										document_issued_to: DocRequest.empl_id,
										document_request_department:
											DocRequest.doc_requested_department,
										document_request_doc_type: DocRequest.doc_requested_doctype,
									},
								};

								const newProduct = new this.documentModal(newDcoument);
								newProduct.isActive = false;
								newProduct.isRequestedDocument = true;

								newProduct.save().then((res) => {
 								});
							});
						}else{ //request Single document
						
								const newDcoument = {
									name: doc.document_name,
									description: doc.document_name,
									no_of_copy: doc.no_of_copy,
									no_of_page: doc.no_of_page,
									document_no: doc.document_no,
									qr_code: doc.document_no,
									reason_for_request : doc.reason_for_request,
									box: "",
									rack: "",
									category: "",
									box_info: [],
									rack_info: [],
									category_info: [],
									document_type: "",
									docType_info: "",
									is_Active: true,
									retension_time: "",
									document_request_info: {
										document_issued_from: document_no,
										document_request_no: DocRequest.request_no,
										document_issued_on: new Date(),
										document_issued_by: doc_issuer.document_issued_by,
										document_requested_by: DocRequest.empl_id,
										document_issued_to: DocRequest.empl_id,
										document_request_department:
											DocRequest.doc_requested_department,
										document_request_doc_type: DocRequest.doc_requested_doctype,
									},
								};
								const newProduct = new this.documentModal(newDcoument);
								newProduct.isActive = false;
								newProduct.isRequestedDocument = true;

								newProduct.save().then((res) => {
									//console.log("+++++++++INsert Single DOc",);
								});
							
						}
					}
					return doc;
				});
			}
			return await this.DocRequestModel.findByIdAndUpdate(id, DocRequest, {
				new: true,
			});
		}
		return await this.DocRequestModel.findByIdAndUpdate(id, DocRequest, {
			new: true,
		});
	}
	async update1(
		id: string,
		DocRequest: DocRequest,
		page: string
	): Promise<DocRequest> {
		if (page === "issueGenaralIssuance") {
			const {
				requested_doc = [],
				issuance: { doc_issued_by = [] } = {},
				doc_requested_department = {},
			} = DocRequest;

			// let selectedDocument:any = [];
			requested_doc.map((doc: any) => {
				if (doc.is_doc_approved && !doc.is_doc_issued) {
					const doc_issuer = doc_issued_by.find(
						(element) => element.document_id === doc.document_no
					);
					doc.is_doc_issued = true;
					const documentList = doc.doc_issuance ? doc.doc_issuance : [];
					if (documentList.length > 0) {
						documentList.forEach((doc) => {
							const newDcoument = {
								name: doc.document_name,
								description: doc.document_name,
								no_of_copy: doc.no_of_copy,
								no_of_page: doc.no_of_page,
								document_no: doc.document_no,
								qr_code: doc.document_no,
								box: "",
								rack: "",
								category: "",
								box_info: [],
								rack_info: [],
								category_info: [],
								document_type: "",
								docType_info: "",
								is_Active: true,
								retension_time: "",
								document_request_info: {
									document_request_no: DocRequest.request_no,
									document_issued_on: new Date(),
									document_issued_by: doc_issuer.document_issued_by,
									document_requested_by: DocRequest.empl_id,
									document_issued_to: DocRequest.empl_id,
									document_request_department: DocRequest.doc_requested_department
										? DocRequest.doc_requested_department
										: {},
									document_request_doc_type: DocRequest.doc_requested_doctype,
								},
							};

							const newProduct = new this.documentModal(newDcoument);
							newProduct.isActive = false;
							newProduct.isRequestedDocument = true;
							newProduct
								.save()
								.then((res) => {
									//console.log("+++++++++INsert DONE=", res);
								})
								.catch((ex) => {
									console.log(ex);
								});
						});
					}
				}
				return doc;
			});

		}
		return await this.DocRequestModel.findByIdAndUpdate(id, DocRequest, {
			new: true,
		});
	}
}

import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document } from "./interfaces/product.interface";
import { Documents } from "./schemas/product.schema";

import { Boxes } from "./schemas/box.schema";
import { Racks } from "./schemas/rack.schema";
import { DocType } from "./schemas/docType.schema";

import moment from "moment";

var QRCode = require("qrcode");

@Injectable()
export class DocumentsService {
	constructor(
		@InjectModel(Documents.name)  
		private productModel: Model<Documents>,
		@InjectModel(Boxes.name) private readonly boxModel: Model<Boxes>,
		@InjectModel(Racks.name) private readonly rackModel: Model<Racks>
	) { }

	async findAll(mode, id = null): Promise<Document[]> { 
 
		if (mode === "issued") {  
			return await this.productModel
				.find(
					// { isActive: false, isRequestedDocument : true, "document_request_info.document_requested_by" :id }
					{
						$or: [
							{
								isActive: false,
								isRequestedDocument: true,
								//"document_request_info.document_requested_by": id,
							},
							{
								isActive: true,
								is_requested_for_takeout: true,
								//"document_request_info.document_requested_by": id,
							},
						],
					}
				)
				.sort({ "document_request_info.document_issued_on": -1 })
				.then((res: any) => {
					return res;
				});
		} else if (mode === "takeOutRequest") {
			return await this.productModel
				.find({
					$or: [
						{
							isActive: true,
							isRequestedDocument: true,
							qr_code: id, 
						},
						{
							isActive: true,
							isRequestedDocument: false,
							qr_code: id,
							"document_info.status": "approved",
							 
						},
					],
				})
				.then((res: any) => {
					return res;
				});
		} else if (mode === "log-sheet") {
			return await this.productModel
				.find({ isActive: false, isRequestedDocument: true })
				.then((res: any) => {
					return res;
				});
		} else {
			return await this.productModel.aggregate([
				{ $match: { name: { $ne: "" }, isActive: { $ne: false },docStatus:{$ne:'destroyed'} } },
				{
					$addFields: {
						converted_rack: {
							$convert: {
								input: "$rack",
								to: "objectId",
								onError: 0,
							},
						},
						converted_category: {
							$convert: {
								input: "$category",
								to: "objectId",
								onError: 0,
							},
						},
						converted_box: {
							$convert: {
								input: "$box",
								to: "objectId",
								onError: 0,
							},
						},
						converted_doctype: {
							$convert: {
								input: "$document_type",
								to: "objectId",
								onError: 0,
							},
						},
					},
				},
				{
					$lookup: {
						from: "racks",
						localField: "converted_rack",
						foreignField: "_id",
						as: "rack_info",
					},
				},
				{
					$lookup: {
						from: "doccategories",
						localField: "converted_category",
						foreignField: "_id",
						as: "category_info",
					},
				},
				{
					$lookup: {
						from: "boxes",
						localField: "converted_box",
						foreignField: "_id",
						as: "box_info",
					},
				},
				{
					$lookup: {
						from: "doctypes",
						localField: "converted_doctype",
						foreignField: "_id",
						as: "docType_info",
					},
				},
				{ $sort : { "document_info.createdOn": -1 } }
			]);
		}
	}


	async takeOutRequest(params : any) { 
		return await this.productModel
		.find({
			$or: [
				{
					qr_code: params.ref_no.value,
					"document_info.status": "approved"
				},
				{
					name:params.search_doc_name.value,					
				   "document_info.status": "approved"
				 },
				{
					description:params.search_desc.value,		 
					"document_info.status": "approved"
				},
				{
					document_no:params.search_doc_num.value,		 
					"document_info.status": "approved"
				} ,
				{ 
				 isRequestedDocument: true, 
				 "document_request_info.document_request_doc_type.id":  params.search_doc_type.value  ,
				 "isActive":  true
				}
			],
		})
		.then((res: any) => {
			return res;
		});
			/* 	.find({
					$or: [
						{
							isActive: true,
							isRequestedDocument: true,
							qr_code: params.referenceNumber, 
							description : params.search_desc.value,
							document_type_details:params.search_doc_type.value,
							name:params.search_doc_name.value,
						},
						{
							isActive: true,
							isRequestedDocument: false,
							qr_code: params.referenceNumber,
							"document_info.status": "approved",
							description : params.search_desc.value,
							document_type_details:params.search_doc_type.value,
							name:params.search_doc_name.value,
							 
						},
					],
				})
				.then((res: any) => {
					return res;
				}); */
	}


	async getCountOfDoc(params : any) 
	{

		console.log("params", params);
		const {field = "", value=""} = params
		if(field === 'category'){
			return await this.productModel
			.find(				
				{
					$or: [
						{
							isActive: false,
							'document_category_details.id': value,
						},
						{
							isActive: true,
							category: value,
						},
					],
				}
			).count()
			.then((res: any) => {
				return res;
			});
		}else if(field === 'box'){
			return await this.productModel
			.find(				
				{
					$or: [
						{
							isActive: false,
							'document_rack_details.id': value,
						},
						{
							isActive: true,
							box: value,
						},
					],
				}
			).count()
			.then((res: any) => {
				return res;
			});
		}else if(field === 'series'){
			return await this.productModel
			.find(				
				{
					$or: [
						{
							isActive: false,
							'document_rack_details.id': value,
						},
						{
							isActive: true,
							rack: value,
						},
					],
				}
			).count()
			.then((res: any) => {
				return res;
			});
		}
		else {
			return []
		}
		
	}
	async findAllDocuments() {
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
		if (product.document_info) {
			if (product.document_info.createdOn) {
				//	newProduct.document_info.createdOn = new Date(product.document_info.createdOn)
			}
			if (product.document_info.approvedOn) {
				newProduct.document_info.approvedOn = new Date(product.document_info.approvedOn)
			}
		}
		newProduct.isActive = true;
		newProduct.isRequestedDocument = false;
		return await newProduct.save();
	}

	async delete(id: string) {
		return await this.productModel.findByIdAndRemove(id);
	}

	async update(id: string, product: Document) {
		const {
			is_requested_for_takeout = false,
			is_requested_for_takeout_submit = false,
			is_requested_for_takeout_return = false,
			is_requested_for_takeout_return_approve = false,
		} = product;

		if (is_requested_for_takeout) {
			if (is_requested_for_takeout_submit) {
				return await this.productModel
					.find({ isActive: true, _id: id })
					.then((res: any) => {
						let documenttoEdit = res[0];
						const {
							takeout_requested_details: {
								takeout_request_details_list = [],
								current_status: { request_no = null } = {},
							} = {},
							takeout_requested_details = {},
						} = documenttoEdit;
						takeout_request_details_list.forEach((list) => {
							if (request_no && list.doc_request_no === request_no) {
								list.doc_submitted_by = "XX";
								list.doc_submitted_on = new Date();
								list.takeout_return_date = product.takeout_return_date;
							}
						});
						let requestDetails = takeout_requested_details;
						requestDetails = {
							current_status: {
								...requestDetails.current_status,
								code: "submitted",
								label: "Submitted",
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
							.then((tre) => { });
					});

				/* return await this.productModel.findByIdAndUpdate(id, product, {
		  new: true,
		}); */
			} else if (is_requested_for_takeout_return) {
				return await this.productModel
					.find({ isActive: true, _id: id })
					.then((res: any) => {
						let documenttoEdit = res[0];
						const {
							takeout_requested_details: {
								takeout_request_details_list = [],
								current_status: { request_no = null } = {},
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
							.then((tre) => { });
					});
			} else if (is_requested_for_takeout_return_approve) {
				return await this.productModel
					.find({ isActive: true, _id: id })
					.then((res: any) => {
						let documenttoEdit = res[0];
						const {
							takeout_requested_details: {
								takeout_request_details_list = [],
								current_status: { request_no = null } = {},
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
						const reset_document = {
							is_requested_for_takeout: false,
							takeout_return_date: null,
						};

						documenttoEdit._doc = {
							...documenttoEdit._doc,
							...reset_document,
							takeout_requested_details: { ...requestDetails },
						};

						return this.productModel
							.findByIdAndUpdate(id, documenttoEdit, {
								new: true,
							})
							.then((tre) => {
							//	console.log("tre", tre);
							});
					});
			} else {
				return await this.productModel.findByIdAndUpdate(id, product, {
					new: true,
				});
			}
		} else {
			 if(product.document_info !== undefined){
				if (product.document_info.approvedOn) {
					product.document_info.approvedOn = new Date(product.document_info.approvedOn)
				}
			 }
			

		 
			return await this.productModel.findByIdAndUpdate(id, product, {
				new: true,
			});
		}
	}

	async destructDoc(idList: string[]) {
		Object.keys(idList).forEach((idw) => {
			let id = idList[idw];
			this.productModel
				.find({ isActive: true, _id: id })
				.then((res: any) => { 
 
					let documenttoEdit = res[0];
					const {
						takeout_requested_details: {
							takeout_request_details_list = [],
							current_status: { request_no = null } = {},
						} = {},
						takeout_requested_details = {},
						retension_time={}					} = documenttoEdit;



					documenttoEdit._doc = {
						retension_time: {
							...retension_time,
							status: "destructed",
							destructed_on: new Date()
						}
					}
						;

					return this.productModel
						.findByIdAndUpdate(id, documenttoEdit, {
							new: true,
						})
						.then((tre) => {

						 
						});
				});
		});

	}



	async getQRCode(qrData) {
		return await this.runAsyncFunctions(qrData).then((result) => {
			let string = result.box + "/" + qrData.rack + "/" + qrData.name;
			return QRCode.toDataURL(string)
				.then((url) => {
					return { qrImage: url };
				})
				.catch((err) => {
					//reject(url)
				});
		});
	}

	async getRandomCode(dat) {
		var text = "";
		var possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		for (var i = 0; i < 10; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return await this.productModel.findOne({ qr_code: text }).then((retuh) => {
			if (retuh === null) {
				return { code: text };
			} else {
				this.getRandomCode({});
			}
		});
	}
	async runAsyncFunctions(qrData) {
		const loopdat = [{ field: "box" }, { field: "rack" }];

		const resiluSet = qrData;
		return Promise.all(
			loopdat.map(async ({ field }, ind) => {
				if (field === "box") {
					await this.boxModel
						.findOne({ _id: qrData.box })
						.then(({ name = "" }) => {
							resiluSet.box = name;
						})
						.catch((err) => { });
					///  console.log(boxName)
				} else if (field === "rack") {
					await this.rackModel
						.findOne({ _id: qrData.rack })
						.then(({ name = "" }) => {
							resiluSet.rack = name;
						})
						.catch((err) => { });
				}
			})
		).then(() => {
			return resiluSet;
		});
	}
	async getLogSheet({
		startDate = new Date(),
		endDate = new Date(),
	}): Promise<Document[]> {

	 
		let date1 = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
		let date2 = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
 


		return await this.productModel.aggregate([		
				{
					$addFields: {
						converted_rack: {
							$convert: {
								input: "$rack",
								to: "objectId",
								onError: 0,
							},
						},
						converted_category: {
							$convert: {
								input: "$category",
								to: "objectId",
								onError: 0,
							},
						},
						converted_box: {
							$convert: {
								input: "$box",
								to: "objectId",
								onError: 0,
							},
						},
						converted_doctype: {
							$convert: {
								input: "$document_type",
								to: "objectId",
								onError: 0,
							},
						},
					},
				},
				{
					$lookup: {
						from: "racks",
						localField: "converted_rack",
						foreignField: "_id",
						as: "rack_info",
					},
				},
				{
					$lookup: {
						from: "doccategories",
						localField: "converted_category",
						foreignField: "_id",
						as: "category_info",
					},
				},
				{
					$lookup: {
						from: "boxes",
						localField: "converted_box",
						foreignField: "_id",
						as: "box_info",
					},
				},
				{
					$lookup: {
						from: "doctypes",
						localField: "converted_doctype",
						foreignField: "_id",
						as: "docType_info",
					},
				},
			{
				"$addFields": {
					"document_info.createdOn": {
						"$dateFromString": {
							"dateString": "$document_info.createdOn"
						}
					},

				},
			},
			{
				"$match": {
					"$or":
						[{ "document_info.createdOn": { "$gte": date1, "$lt": date2 } },
						{
							"document_request_info.document_issued_on": {
								$gte: date1,
								$lt: date2,
							}
						}
						]
				}
			}

		])
	}

	async getDestructiveDocList({
		startDate = new Date(),
		endDate = new Date(),
	}): Promise<Document[]> {
		
		let date1 = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
		let date2 = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
		return await this.productModel.aggregate([						 
			{
				"$addFields": {
					"retension_time.retension_exact_date": {
						"$dateFromString": {
							"dateString": "$retension_time.retension_exact_date"
						}
					},

				},
			},
			{
				"$match": 
					{ "retension_time.retension_exact_date": { "$gte": date1, "$lt": date2 } , type_of_space : "non_perceptual", isActive : true},
						 
						
				
			}

		]);



		/* return await this.productModel.find({
			type_of_space : "non_perceptual",
			"retension_time.retension_exact_date": {
				$gte: date1,
				$lte: date2,
			}
		})
			.then((res: any) => {
				return res;
			}); */
	}


	async getAuditLogList({
		startDate = new Date(),
		endDate = new Date(),
	}): Promise<Document[]> {
		let date1 = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
		let date2 = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
		return await this.productModel.find(
			{
				$or: [
					{
						"document_info.approvedOn": {
							$gte: date1,
							$lte: date2,
						}, "document_info.status": 'approved', "isRequestedDocument": false,
					},
					{
						"document_info.approvedOn": {
							$gte: date1,
							$lte: date2,
						}, "document_info.status": 'approved', "isRequestedDocument": false,
					},
				],
			}
			/* {
			"document_info.approvedOn": {
				$gte: date1,
				$lte: date2,
			}, "document_info.status": 'approved', "isRequestedDocument": false,
		} */
		)
			.then((res: any) => {
				return res;
			});
	}
}

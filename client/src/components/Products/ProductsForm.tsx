import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
	IStateType,
	IProductState,
	IDocCategoryState,
	IBoxState,
	IDocTypeState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";

import {
	IProduct,
	ProductModificationStatus,
} from "../../store/models/product.interface";

import { IRack } from "../../store/models/box.interface";
import { IProductList } from "../../store/models/product.interface";
import TextInput from "../../common/components/TextInput";
import DateInput from "../../common/components/DateInput";
import PrintCode from "../../common/components/PrintCode";
import CalculateNonPerceptualTime from "../../common/components/CalculateNonPerceptualTime";

import {
	editProduct,
	clearSelectedProduct,
	setModificationState,
	addProduct,
	loadListOfProduct,
} from "../../store/actions/products.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
	addNewDoc,
	updateDoc,
	getRacks,
	getDocumentList,
	getNewQrCode,
} from "../../services/index";
import {
	OnChangeModel,
	IProductFormState,
} from "../../common/types/Form.types";
import SelectInput from "../../common/components/Select";
import Checkbox from "../../common/components/Checkbox";
import { IAccount } from "../../store/models/account.interface";
/* import DatePicker, {
  DayValue,
  DayRange,
  Day,
} from "react-modern-calendar-datepicker"; */
import uniquebg from "../../assets/images/uniquebg.png";
import APP_CONST from "../../common/contant";
const ProductForm: React.FC = () => {
	const account: IAccount = useSelector((state: IStateType) => state.account);
	//const componentRef = useRef();

	const products: IProductState | null = useSelector(
		(state: IStateType) => state.products
	);

	let product: IProduct | null = products.selectedProduct;
	const isCreate: boolean =
		products.modificationState === ProductModificationStatus.Create;
	const { roles = [], name, email, emp_id } = account;
	const [boxRacks, setBoxRacks] = useState([]);
	const [formWithError, setFormWithError] = useState(false);
	const [pickRack, setPickedRack] = useState(false);
	const [qrRequested, setQrRequested] = useState({
		name: "",
		box: "",
		rack: "",
	});
	const [, setQrModified] = useState(false);
	const selectField = ["box"];
	const dispatch: Dispatch<any> = useDispatch();

	const [touchedFields, setTouchedFields] = useState({
		box: false,
		rack: false,
		category: false,
		document_type: false,
		type_of_space: false,
	});

	//"expiredate" manufacturedate

	//Document Category loaded
	const doccategoriesList: IDocCategoryState | null = useSelector(
		(state: IStateType) => state.docCategories
	);
	let listOfCate: { id: string; name: string }[] = [];
	doccategoriesList.docCategories.forEach((doc) => {
		let me = { id: doc._id, name: doc.name };
		listOfCate.push(me);
	});
	//Document Boxes loaded
	const boxes: IBoxState = useSelector((state: IStateType) => state.boxes);
	let listOfBoxws: { id: string; name: string }[] = [];
	boxes.boxes.forEach((doc) => {
		let me = { id: doc._id, name: doc.name };
		listOfBoxws.push(me);
	});

	//Document Types loaded
	const docTypeList: IDocTypeState | null = useSelector(
		(state: IStateType) => state.docTypes 
	);
	let listOfType: { id: string; name: string }[] = [];
	docTypeList.docTypes.forEach((doc) => {
		let me = { id: doc._id, name: doc.name };
		listOfType.push(me);
	});

	if (!product || isCreate) {
		product = {
			_id: "",
			name: "",
			description: "",
			box: "",
			rack: "",
			category: "",
			type_of_space: "",
			document_type: "",
			qr_code: "",
			manufacturedate: "",
			expiredate: "",
			document_info: {},
			retension_time: {
				time: 0,
				defaultYear: APP_CONST.DEFAULT_PERCEPTUAL_YEAR_TO_ADD,
				calculateNonPerceptualTime: "",
				retension_exact_date : ""
			},
			document_request_info: {},
			takeout_return_date: new Date(),
			is_requested_for_takeout: false,
			takeout_requested_details: {},
			doc_requested_department: account.departments[0],
			document_type_details : {}
		};
	} else {
		const { box = "", rack = "" } = product;

		if (box) {
			let selectBox = boxes.boxes.filter((boxe) => boxe.name === box);
			let selectedBox = "";
			if (selectBox.length > 0) {
				selectedBox = selectBox[0]._id;
			}

			if (selectedBox && rack && boxRacks.length === 0) {
				getRacks(selectedBox).then((racks = []) => {
					if (racks.length > 0) {
						setBoxRacks(racks);
						setPickedRack(true);
					}
				});
			}
		}
	}
 

	const [formState, setFormState] = useState({
		_id: { error: "", value: product._id },
		name: { error: "", value: product.name },
		description: { error: "", value: product.description },
		box: { error: "", value: product.box },
		rack: { error: "", value: product.rack },
		category: { error: "", value: product.category },
		type_of_space: { error: "", value: product.type_of_space },
		document_type: { error: "", value: product.document_type },

		qr_code: { error: "", value: product.qr_code },
		manufacturedate: { error: "", value: product.manufacturedate },
		expiredate: { error: "", value: product.expiredate },
		retension_time: {
			error: "",
			value: { 
				time: product.retension_time.time,
				defaultYear: product.retension_time.defaultYear,
				retension_exact_date : product.retension_time.retension_exact_date, 
				calculateNonPerceptualTime:
					product.retension_time.calculateNonPerceptualTime,
			},
		},
		document_request_info: {},
		takeout_return_date: { error: "", value: product.takeout_return_date },
		is_requested_for_takeout: {
			error: "",
			value: product.is_requested_for_takeout,
		},
		document_type_details : { error: "", value: product.document_type_details },
	});

	if (formState.qr_code.value === "") {
		generateCode().then((res) => {
			setFormState({
				...formState,

				["qr_code"]: { error: "", value: res.code },
			});
		});
	}
	function add_years(n: number) {
		let dt = new Date();
		const calcDat = new Date(dt.setFullYear(dt.getFullYear() + n));
		

		return {exactDate : calcDat, rentention :("0" + (calcDat.getMonth() + 1)).slice(-2) + "/" + calcDat.getFullYear() }
		 
	}

	function hasRetensionChanged(model: OnChangeModel) {
		const value : any = model.value ||{};
		const selDate:any  = value.value;
 

		
		let timeSeed = new Date(selDate).getUTCFullYear() - new Date().getUTCFullYear();// parseInt(value.toString());
		
		
		const {  rentention=''} = add_years(timeSeed);
 ;
		setFormState({
			...formState,
			["retension_time"]: {
				error: "",
				value: {
					time: timeSeed,
					defaultYear: APP_CONST.DEFAULT_PERCEPTUAL_YEAR_TO_ADD,
					retension_exact_date: new Date(selDate).toString(),
					calculateNonPerceptualTime: rentention.toString(),
				},
			},
		});
	}
	function hasFormValueChanged(model: OnChangeModel): void {
		const { field, value = "", name = "" } = model;
		if (selectField.indexOf(field) > -1) {
			setTouchedFields({ ...touchedFields, [model.field]: true });
			getRacks(value).then((racks = []) => {
				if (racks.length > 0) {
					setPickedRack(true);
					setBoxRacks(racks);
					// dispatch(updateRacks(racks));
				}
			});
			setFormState({
				...formState,
				[model.field]: { error: model.error, value: model.value },
			});
			setQrRequested(
				Object.assign({ ...qrRequested }, { [model.field]: model.value })
			);
			setQrModified(true);
		} else {
			//Prepare QR
			if (field === "name") {
				setQrRequested(
					Object.assign({ ...qrRequested }, { [model.field]: value })
				);
				// setQrModified(true);
			}

			if (name === "type_of_space") {
				setTouchedFields({ ...touchedFields, ["type_of_space"]: true });
				 
				if (model.field === "perceptual") {
					setFormState({
						...formState,
						["retension_time"]: {
							error: "",
							value: {
								time: APP_CONST.DEFAULT_PERCEPTUAL_YEAR_TO_ADD,
								defaultYear: APP_CONST.DEFAULT_PERCEPTUAL_YEAR_TO_ADD,
								retension_exact_date : "",
								calculateNonPerceptualTime: "", 
							},
						},
						[model.name]: { error: model.error, value: model.field },
					});
				} else {
					setFormState({
						...formState,
						[model.name]: { error: model.error, value: model.field },
					});
				}
			} else {
				setTouchedFields({ ...touchedFields, [model.field]: true });
				setFormState({
					...formState,
					[model.field]: { error: model.error, value: model.value },
				});
			}
		}
	}
	function hasRacksValueChanged(model: OnChangeModel): void {
		const newObj: any = boxRacks;
		const { field = "" } = model;

		boxRacks.forEach((rack: IRack, index) => {
			if (rack._id === field) {
				newObj[index]["picked"] = true;
			} else {
				newObj[index]["picked"] = false;
			}
		});
		setBoxRacks(newObj);

		setFormState({
			...formState,
			["rack"]: { error: model.error, value: field },
		});
		setTouchedFields({ ...touchedFields, ["rack"]: true });
	}

	function saveUser(event: FormEvent<HTMLFormElement>): void {
		//var target = document.activeElement;

		event.preventDefault();
		if (!isFormInvalid()) {
			setFormWithError(!formWithError);
		} else {
			let saveUserFn: Function = isCreate ? addProduct : editProduct;
			let modeOfAction: String = isCreate ? "ADD" : "EDIT";
			saveForm(formState, saveUserFn, modeOfAction);
		}
	}

	function saveForm(
		formState: IProductFormState,     
		saveFn: Function,
		mode: String
	): void {
		if (product) {
			const loggedInUserRole = roles[0] ? roles[0] : "Developer";
			const currentUser = {
				role: loggedInUserRole,
				name,
				email,
				emp_id
			};

			if (mode === "ADD") {

				let boxInfo = {
					name: formState.name.value,
					description: formState.description.value,
					box: formState.box.value,
					rack: formState.rack.value,
					category: formState.category.value,
					qr_code: formState.qr_code.value,
					document_no: formState.qr_code.value,
					manufacturedate: formState.manufacturedate.value,
					expiredate: formState.expiredate.value,
					type_of_space: formState.type_of_space.value,
					document_type: formState.document_type.value,
					document_info: {
						active: true,
						status:
							loggedInUserRole === "Qualityuser" ? "approved" : "n-approved",
						createdBy: { ...currentUser },
						createdOn: new Date(),
					},
					retension_time: formState.retension_time.value,
					document_type_details: {},
					document_box_details: {},
					document_category_details: {},
					document_rack_details: {},
				};

				
				if (					 
					loggedInUserRole === "Qualityuser" 
				) {
					const document_info = {
						...boxInfo.document_info,
						status: "approved",
						approvedBy: currentUser,
						approvedOn: new Date()
					};
					boxInfo = { ...boxInfo, ...{ document_info: document_info } };
				}

				if (formState.box.value) {
					 
					let selectedboxOfDoc =
					listOfBoxws.filter((dcT: any) => dcT.id === formState.box.value) || [];

					if (selectedboxOfDoc.length > 0) { 
						boxInfo.document_box_details = selectedboxOfDoc[0] ? selectedboxOfDoc[0] : {};
					}
				}
				if (formState.category.value) {
					 
					let selectedCatOfDoc =
					listOfCate.filter((dcT: any) => dcT.id === formState.category.value) || [];

					if (selectedCatOfDoc.length > 0) { 
						boxInfo.document_category_details = selectedCatOfDoc[0] ? selectedCatOfDoc[0] : {};
					}
				}
				if (formState.rack.value) {

					let listOfBoxws: { id: string; name: string }[] = [];
						boxRacks.forEach((doc:any) => {
							let me = { id: doc._id, name: doc.name };
							listOfBoxws.push(me);
						});
				 
					let selectedRackOfDoc =
					listOfBoxws.filter((dcT: any) => dcT.id === formState.rack.value) || [];

					if (selectedRackOfDoc.length > 0) { 
						boxInfo.document_rack_details = selectedRackOfDoc[0] ? selectedRackOfDoc[0] : {};
					}
				}




				if (formState.document_type.value && !touchedFields.document_type) {
					
					let selectedTypeOfDoc =
						listOfType.filter((dcT: any) => dcT.id === formState.document_type.value) || [];

					if (selectedTypeOfDoc.length > 0) {
						boxInfo.document_type_details = selectedTypeOfDoc[0] ? selectedTypeOfDoc[0] : {};
					}
				}else{
					let selectedTypeOfDoc =
					listOfType.filter((dcT: any) => dcT.id === formState.document_type.value) || [];

					if (selectedTypeOfDoc.length > 0) {				 
						boxInfo.document_type_details = selectedTypeOfDoc[0] ? selectedTypeOfDoc[0] : {};
					}
				}
 

				addNewDoc(boxInfo, account).then((status) => {
					getDocumentList(account.auth, { userId: account.emp_id }).then(
						(items: IProductList) => {
							dispatch(loadListOfProduct(items));
						}
					); 
					dispatch(
						addNotification(
							"New Document added",
							`Document ${formState.name.value} added by you`
						)
					);
					dispatch(clearSelectedProduct());
					dispatch(setModificationState(ProductModificationStatus.None));
				});
			} else if (mode === "EDIT") {
				let boxInfoUpt = {
					id: formState._id.value,
					name: formState.name.value,
					description: formState.description.value,
					box: formState.box.value,
					rack: formState.rack.value,
					category: formState.category.value,
					manufacturedate: formState.manufacturedate.value,
					expiredate: formState.expiredate.value,
					type_of_space: formState.type_of_space.value,
					qr_code: formState.qr_code.value,
					document_type: formState.document_type.value,
					retension_time: formState.retension_time.value,
					document_type_details: formState.document_type_details.value,
				};
				let seltdPro = products?.products.filter(
					(pro) => pro._id === formState._id.value
				)[0];
				const { document_info = {} } = seltdPro || {};

				let updatedByArrau = [{ ...currentUser, updatedOn: new Date() }];
				if (document_info.updatedBy) {
					updatedByArrau = [
						...document_info.updatedBy,
						{ ...currentUser, updatedOn: new Date() },
					];
				}

				let updatedDoc_Info = {
					...document_info,
					updatedBy: updatedByArrau,
				};
				if (
					formState.type_of_space.value &&
					loggedInUserRole === "Qualityuser" &&
					document_info.status === "n-approved"
				) {
					updatedDoc_Info = {
						...updatedDoc_Info,
						status: "approved",
						approvedBy: currentUser,
						approvedOn: new Date()
					};
				}
				boxInfoUpt = { ...boxInfoUpt, ...{ document_info: updatedDoc_Info } };

				const {
					box = "",
					category = "",
					rack = "",
					document_type = "",
				} = product;
				if (category && !touchedFields.category) {
					let selectedCat =
						doccategoriesList?.docCategories.filter(
							(catee) => catee.name === category
						) || [];
					if (selectedCat.length > 0) {
						boxInfoUpt.category = selectedCat[0]._id;
					}
				}
				if (box && !touchedFields.box) {
					let selectBox = boxes.boxes.filter((boxe) => boxe.name === box);
					if (selectBox.length > 0) {
						boxInfoUpt.box = selectBox[0]._id;
					}
				}
				if (rack && !touchedFields.rack) {
					let selectedRacks = boxRacks.filter((rck: any) => rck.name === rack);
					if (selectedRacks.length > 0) {
						boxInfoUpt.rack = selectedRacks[0]["_id"];
					}
				}
				if (document_type && !touchedFields.document_type) {
					
					let selectedTypeOfDoc =
						listOfType.filter((dcT: any) => dcT.name === document_type) || [];
					 
					if (selectedTypeOfDoc.length > 0) {
						boxInfoUpt.document_type = selectedTypeOfDoc[0].id;
						boxInfoUpt.document_type_details = selectedTypeOfDoc[0] ? selectedTypeOfDoc[0] : {};
					}
				}else{
					let selectedTypeOfDoc =
					listOfType.filter((dcT: any) => dcT.id === document_type) || [];

					if (selectedTypeOfDoc.length > 0) {				 
						boxInfoUpt.document_type_details =  selectedTypeOfDoc[0] ? selectedTypeOfDoc[0] : {};
					}
				}
				updateDoc(boxInfoUpt, account).then((status) => {
					dispatch(
						saveFn({
							...product,
							...status,
						})
					);

					getDocumentList(account.auth, { userId: account.emp_id }).then(
						(items: IProductList) => {
							dispatch(loadListOfProduct(items));
						}
					);
					dispatch(
						addNotification(
							"Box ",
							`Document ${formState.name.value} edited by you`
						)
					);
					dispatch(clearSelectedProduct());
					dispatch(setModificationState(ProductModificationStatus.None));
				});
			}
		}
	}

	function cancelForm(): void {
		dispatch(setModificationState(ProductModificationStatus.None));
	}

	// function getDisabledClass(): string {
	//   let isError: boolean = isFormInvalid();
	//   return isError ? "disabled" : "";
	// }
	function isFormInvalid(): boolean {
		let formIsValid = true;
		if (formState.name.value === "") {
			formIsValid = false;
			formState.name.error = "Document name is mandatory";
		} else if (formState.document_type.value === "") {
			formIsValid = false;
			formState.document_type.error = "Document Type is mandatory";
		} else if (formState.category.value === "" && roles[0] === "Qualityuser") {
			formIsValid = false;
			formState.category.error = "Compactor is mandatory";
		} else if (formState.description.value === "") {
			formIsValid = false;
			formState.description.error = "Description is mandatory";
		} else if (formState.qr_code.value === "" && roles[0] === "Qualityuser") {
			formIsValid = false;
			formState.qr_code.error = "Qr Code for the doc is mandatory";
		} else if (formState.box.value === "" && roles[0] === "Qualityuser") {
			formIsValid = false;
			formState.box.error = "Rack system is mandatory";
		} else if (formState.rack.value === "" && roles[0] === "Qualityuser") {
			formIsValid = false;
			formState.rack.error = "Series is mandatory";
		} else if (
			formState.type_of_space.value === "" &&
			roles[0] === "Qualityuser"
		) {
			formIsValid = false;
			formState.type_of_space.error = "Type of space is mandatory";
		}

		setFormState(formState);

		return formIsValid;
	}

	function loadRacks() {
		if (boxRacks.length > 0) {
			const { rack = "" } = product || {};
			return boxRacks.map((rack2) => {
				const { name, _id, status, picked = false, box = "" } = rack2; //destructuring

				let disbaledStatus = false;
				let pickedStatus = picked;
				if (formState.rack.value) {
					if (formState.rack.value === name) {
						pickedStatus = true;
					} else if (formState.rack.value === _id) {
						pickedStatus = true;
					}
				} else {
					if (product?.box === box) {
						let selectdRack = _id === rack ? _id : "";
						pickedStatus = _id === selectdRack ? true : pickedStatus;
					}
				}

				if (status === "Occupied") {
					disbaledStatus = true;
					pickedStatus = true;
				}

				return (
					<div className="col-xs-2" key={_id}>
						{" "}
						<Checkbox
							id="input_email"
							field={_id}
							onChange={hasRacksValueChanged}
							label={name}
							value={pickedStatus}
							name={name}
							disabled={disbaledStatus}
							customError={""}
						/>
					</div>
				);
			});
		}
	}
	function checkPossibleToGenerateQR(dataToProcess: any) {
		let availableToMakeQrRequest = false;

		if (dataToProcess.name.value !== "") {
			availableToMakeQrRequest = true;
		} else {
			availableToMakeQrRequest = false;
		}
		if (availableToMakeQrRequest && dataToProcess.rack.value !== "") {
			availableToMakeQrRequest = true;
		} else {
			availableToMakeQrRequest = false;
		}
		if (availableToMakeQrRequest && dataToProcess.box.value !== "") {
			availableToMakeQrRequest = true;
		} else {
			availableToMakeQrRequest = false;
		}

		if (availableToMakeQrRequest) {
			getNewQrCode(dataToProcess).then((status) => {
				let newObject = Object.assign(
					{},
					{ ...dataToProcess },
					{ ["qr_code"]: { error: "", value: status.qrImage } }
				);

				setQrModified(false);
				setFormState(newObject);
			});
		} else {
			setFormState(dataToProcess);
		}
	}

	function generateCode() {
		return getNewQrCode(formState).then((status) => {
			return status;
		});
	}

	let type_of_space_Check = "";
	if (formState.type_of_space !== undefined) {
		type_of_space_Check = formState.type_of_space.value;
	}
	function printOrder() {
		var myWindow = window.open("", "", "width=750,height=750");
		myWindow?.document.write(
			document.getElementById("uniquename")?.innerHTML || "No Code"
		);

		myWindow?.document.close();
		myWindow?.focus();
		myWindow?.print();
		myWindow?.close();
	}

	return (
		<Fragment>
			<div className="col-xl-7 col-lg-7">
				<div className="card shadow mb-4">
					<div className="card-header py-2">
						<h6 className="m-0 font-weight-bold text-white">
							Document {isCreate ? "create" : "edit"}
						</h6>
					</div>
					<div className="card-body">
						<form onSubmit={saveUser}>
							<div className="form-row 14 font-14">
								<div className="form-group col-md-6">
									<TextInput
										id="input_email"
										value={formState.name.value}
										customError={formState.name.error}
										field="name"
										onChange={hasFormValueChanged}
										required={true}
										maxLength={20}
										label="Name of the document"
										placeholder="Name of the document"
									/>
								</div>

								<div className="form-group col-md-6">
									<SelectInput
										id="input_document_type"
										field="document_type"
										label="Type of Document"
										options={listOfType}
										required={true}
										onChange={hasFormValueChanged}
										value={formState.document_type.value}
										type="select"
										customError={formState.document_type.error}
									/>
								</div>
								{roles[0] === "Qualityuser" && (
									<div className="form-group col-md-6">
										<SelectInput
											id="input_category"
											field="category"
											label="Compactor"
											options={listOfCate}
											required={true}
											onChange={hasFormValueChanged}
											value={formState.category.value}
											type="select"
											customError={formState.category.error}
										/>
									</div>
								)}
							</div>
							<div className="form-row 13 font-14">
								<div className="form-group col-md-12">
									<TextInput
										id="input_description"
										field="description"
										value={formState.description.value}
										onChange={hasFormValueChanged}
										required={false}
										maxLength={100}
										label="Description"
										placeholder="Description"
										customError={formState.description.error}
									/>
								</div>
							</div>
							<div className="form-row 12 font-14">
								<div className="form-group col-md-6">
									<DateInput
										id="manufacturedate"
										field="manufacturedate"
										value={
											formState.manufacturedate.value
												? new Date(formState.manufacturedate.value)
												: new Date('0001-01-01T00:00:00Z')
										}
										required={false}
										label="Manufacture date"
										placeholder="Manufacture date"
										onChange={hasFormValueChanged}
									/>
								</div>
								<div className="form-group col-md-6">
									<DateInput
										id="expiredate"
										field="expiredate"
										value={
											formState.expiredate.value
												? new Date(formState.expiredate.value)
												: new Date('0001-01-01T00:00:00Z')
										}
										required={false}
										label="Expire date   "
										placeholder="Expire date"
										onChange={hasFormValueChanged}
									/>
								</div>
							</div>
							{roles[0] === "Qualityuser" && (
								<div className="form-row 12 font-14">
									<div className="form-group col-md-6">
										<div className="form-row">
											<div className="form-group col-md-12">
												<SelectInput
													id="input_box"
													field="box"
													label="Rack system"
													options={listOfBoxws}
													required={true}
													onChange={hasFormValueChanged}
													value={formState.box.value}
													type="select"
													customError={formState.box.error}
												/>
											</div>
										</div>
										<div className="form-row">
											<div className="form-group col-md-12">
												{" "}
												{pickRack && (
													<div className="form-row">Series {loadRacks()}</div>
												)}
												{formState.rack.error ? (
													<div className="invalid-field">
														{formState.rack.error}
													</div>
												) : null}
											</div>
										</div>
									</div>
								</div>
							)}

							<div className="form-row">
								<div className="form-group col-md-12 font-14">
									{roles[0] === "Qualityuser" && (
										<>
											{" "}
											<div className="mb-3">Type of Space</div>
											<div className="form-row">
												<div
													className="col-md-12"
													style={{ paddingLeft: "10px" }}
													key={"perceptual_space"}
												>
													{" "}
													<Checkbox
														id="input_email"
														field={"perceptual"}
														onChange={hasFormValueChanged}
														label={"Perpetual documents "}
														value={
															type_of_space_Check === "perceptual"
																? true
																: false
														}
														name={"type_of_space"}
														disabled={false}
														customError={""}
													/>
													<br />{" "}
													<Checkbox
														id="input_email"
														field={"non_perceptual"}
														onChange={hasFormValueChanged}
														label={"Non Perpetual documents "}
														value={
															type_of_space_Check === "non_perceptual"
																? true
																: false
														}
														name={"type_of_space"}
														disabled={false}
														customError={""}
													/>
													{type_of_space_Check === "non_perceptual" && (
														<CalculateNonPerceptualTime
															onChange={hasRetensionChanged}
															value={formState.retension_time.value}
														/>
													)}
												</div>
												<div className="col-md-12">
													{formState.type_of_space.error ? (
														<div className="invalid-field">
															{formState.type_of_space.error}
														</div>
													) : null}
												</div>
											</div>{" "}
										</>
									)}
								</div>

								<div className="form-group col-md-12">
									<div className="form-row">
										<div className="col-md-12" key={"non_perceptual_space"}>
											{" "}
											{/*  <QRCODE
                          value={formState.qr_code.value}
                          modified={qrModified}
                        />  style={{                
             "backgroundImage": URL(uniquebg : string),                                
              height: "576px"          
     }} */}{" "}
											<div className="card print-section">
												<div className="card-body text-center">
													<div
														className="uniquename"
														style={{
															backgroundImage: "url(" + uniquebg + ")",
															backgroundPosition: "center",
															backgroundSize: "cover",
															backgroundRepeat: "no-repeat",
															height: "58px",
															width: "300px",
															textAlign: "center",
														}}
													>
														<span style={{ fontSize: "32px" }}>
															{formState.qr_code.value}
														</span>
													</div>{" "}
													<PrintCode
														code={formState}
														docCategories={doccategoriesList.docCategories}
													/>
												</div>
												<div className="card-footer text-right">
													<div>
														<button
															onClick={printOrder}
															className="btn btn-primary font-14"
														>
															Print
														</button>
													</div>
												</div>
											</div>
										</div>{" "}
									</div>
								</div>
							</div>

							<button
								className="btn btn-danger font-14"
								onClick={() => cancelForm()}
							>
								Cancel
							</button>
							<button
								type="submit"
								className={`btn btn-success left-margin font-14`}
							>
								Save
							</button>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default ProductForm;

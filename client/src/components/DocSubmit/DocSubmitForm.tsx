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
	getIssuedDocumentList,
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
import { trimStart } from "lodash";

const ProductForm: React.FC = () => {
	const account: IAccount = useSelector((state: IStateType) => state.account);
	//const componentRef = useRef();

	const products: IProductState | null = useSelector(
		(state: IStateType) => state.products
	);

	let product: IProduct | null = products.selectedProduct;
	const isCreate: boolean =
		products.modificationState === ProductModificationStatus.Create;

	const { roles = [], name, email } = account;

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
	const [documentReadyToReturn, setDocumentReadyToReturn] = useState(false);
	const [documentReturnReadyToApprove, setDocumentReturnReadyToApprove] =
		useState(false);
	const [documentConfirmToTakeout, setDocumentConfirmToTakeout] =
		useState(false);

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

	var future = new Date();
	future.setDate(future.getDate() + 30);

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
			manufacturedate: new Date(),
			expiredate: new Date(),
			document_info: {},
			retension_time: {
				time: 0,
				defaultYear: 4,
				calculateNonPerceptualTime: "",
			},
			document_request_info: {},
			is_requested_for_takeout: false,
			takeout_return_date: future,
			takeout_requested_details: {},

			doc_requested_department: {},
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
		takeout_return_date: {
			error: "",
			value: product.takeout_return_date ? product.takeout_return_date : future,
		},

		retension_time: {
			error: "",
			value: {
				time: product.retension_time ? product.retension_time.time : 0,
				defaultYear: product.retension_time
					? product.retension_time.defaultYear
					: 0,
				calculateNonPerceptualTime: product.retension_time
					? product.retension_time.calculateNonPerceptualTime
					: 0,
			},
		},
		document_request_info: { error: "", value: product.document_request_info },
		is_requested_for_takeout: {
			error: "",
			value: product.is_requested_for_takeout,
		},
		document_type_details: { error: "", value: product.document_type_details },
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
		return (
			("0" + (calcDat.getMonth() + 1)).slice(-2) + "/" + calcDat.getFullYear()
		);
	}

	function hasRetensionChanged(model: OnChangeModel) {
		const { value = 0 } = model;
		let timeSeed = parseInt(value.toString());

		setFormState({
			...formState,
			["retension_time"]: {
				error: "",
				value: {
					time: timeSeed,
					defaultYear: 3,
					calculateNonPerceptualTime: add_years(timeSeed).toString(),
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
								time: 0,
								defaultYear: 3,
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
			};

			if (mode === "ADD") {
				let boxInfo = {
					name: formState.name.value,
					description: formState.description.value,
					box: formState.box.value,
					rack: formState.rack.value,
					category: formState.category.value,
					qr_code: formState.qr_code.value,
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
					isActive: true,
					retension_time: formState.retension_time.value,
					document_type_details: formState.document_type_details.value,
				};

				addNewDoc(boxInfo, account).then((status) => {
					getIssuedDocumentList(account, { userId: account.emp_id }).then(
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
				const sumittedDocInfo = {
					document_submitted_on: new Date(),
					document_submitted_by: account.emp_id,
				};
				let boxInfoUpt = {
					id: formState._id.value,
					name: formState.name.value,
					description: formState.description.value,
					box: formState.box.value,
					rack: formState.rack.value,
					category: formState.category.value,
					manufacturedate: formState.manufacturedate.value
						? formState.manufacturedate.value
						: new Date(),
					expiredate: formState.expiredate.value
						? formState.expiredate.value
						: new Date(),
					type_of_space: formState.type_of_space.value,
					qr_code: formState.qr_code.value,
					document_type: formState.document_type.value,
					retension_time: formState.retension_time.value,
					isActive: true,
					document_request_info: formState.document_request_info.value,
					is_requested_for_takeout: formState.is_requested_for_takeout.value,
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
				//,

				let updatedDoc_Info = {
					...document_info,
					active: true,
					createdBy: { ...currentUser },
					createdOn: new Date(),
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
					};
				}
				//  takeout_return_date : formState.takeout_return_date.value,
				let takeOut = {};
				if (
					formState.is_requested_for_takeout &&
					!documentReadyToReturn &&
					!documentReturnReadyToApprove
				) {
					takeOut = {
						takeout_return_date: formState.takeout_return_date.value,
						is_requested_for_takeout_submit: true,
					};
				} else if (documentReadyToReturn && !documentReturnReadyToApprove) {
					takeOut = { is_requested_for_takeout_return: true };
				} else if (documentReturnReadyToApprove) {
					takeOut = { is_requested_for_takeout_return_approve: true };
				}

				boxInfoUpt = {
					...boxInfoUpt,
					...takeOut,
					...{
						document_info: updatedDoc_Info,
						document_request_info: {
							...boxInfoUpt.document_request_info,
							...sumittedDocInfo,
						},
					},
				};


				updateDoc(boxInfoUpt, account).then((status) => {
					dispatch(
						saveFn({
							...product,
							...status,
						})
					);

					getIssuedDocumentList(account, { userId: account.emp_id }).then(
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

	const {
		takeout_requested_details: { current_status: { code = "" } = {} } = {},
		is_requested_for_takeout = false,
	} = product;

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
							{!product.is_requested_for_takeout && (
								<div className="form-row 12 font-14">
									<div className="form-group col-md-6">
										<DateInput
											id="manufacturedate"
											field="manufacturedate"
											value={
												formState.manufacturedate.value
													? formState.manufacturedate.value
													: new Date()
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
													: new Date()
											}
											required={false}
											label="Expire date   "
											placeholder="Expire date"
											onChange={hasFormValueChanged}
										/>
									</div>
								</div>
							)}
							{product.is_requested_for_takeout && (
								<div className="form-row 12 font-14">
									<div className="form-group col-md-7">
										<DateInput
											id="takeout_return_date"
											field="takeout_return_date"
											value={
												formState.takeout_return_date.value
													? formState.takeout_return_date.value
													: new Date()
											}
											required={false}
											label="TakeOut Return date( Default  : 30 Days)"
											placeholder="Return date"
											onChange={hasFormValueChanged}
										/>
									</div>
								</div>
							)}
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
							<div className="form-group col-md-12">
								{product.is_requested_for_takeout && (
									<div className="form-row">
										<button
											className="btn btn-danger font-14"
											onClick={() => cancelForm()}
										>
											Cancel
										</button>

										{documentConfirmToTakeout && code === "issued" && (
											<button
												type="submit"
												className={`btn btn-success left-margin font-14`}
											>
												Takeout
											</button>
										)}
										{code === "issued" && (
											<div style={{ padding: "12px 4px 3px 12px" }}>
												<Checkbox
													id="input_email"
													field={"id_doc_takeout_retuen"}
													onChange={(e: any) => {
														setDocumentConfirmToTakeout(
															!documentConfirmToTakeout
														);
													}}
													label={"Document confirm to takeout"}
													value={documentConfirmToTakeout}
													name={"id_doc_takeout_retuen"}
													disabled={false}
													customError={""}
												/>
											</div>
										)}

										{documentReadyToReturn && (
											<button
												type="submit"
												className={`btn btn-success left-margin font-14`}
											>
												Return
											</button>
										)}

										{code === "submitted" && is_requested_for_takeout && (
											<div style={{ padding: "12px 4px 3px 12px" }}>
												<Checkbox
													id="input_email"
													field={"id_doc_takeout_retuen"}
													onChange={(e: any) => {
														setDocumentReadyToReturn(!documentReadyToReturn);
													}}
													label={"Document ready to return"}
													value={documentReadyToReturn}
													name={"id_doc_takeout_retuen"}
													disabled={false}
													customError={""}
												/>
											</div>
										)}

										{code === "returned" && documentReturnReadyToApprove && (
											<button
												type="submit"
												className={`btn btn-success left-margin font-14`}
											>
												Approve Return
											</button>
										)}

										{code === "returned" && (
											<div style={{ padding: "12px 4px 3px 12px" }}>
												<Checkbox
													id="input_email"
													field={"id_doc_takeout_retuen"}
													onChange={(e: any) => {
														setDocumentReturnReadyToApprove(
															!documentReturnReadyToApprove
														);
													}}
													label={"Document return ready to approve"}
													value={documentReturnReadyToApprove}
													name={"id_doc_takeout_retuen"}
													disabled={false}
													customError={""}
												/>
											</div>
										)}
									</div>
								)}
								{!product.is_requested_for_takeout && (
									<div className="form-row">
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
									</div>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default ProductForm;

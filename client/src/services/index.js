import {
	getDocCustomGetOptions,
	getDocCustomPostOptions,
	getDocCustomPutOptions,
} from "../common/utils";

import APP_CONST from "../common/contant";
export function confirmEmailToken(options) {
	//localhost:3000http://localhost:3001/emailconfirmation#4295787
	return fetch(APP_CONST.API_HOST_AT + "/auth/email/verify/"+options)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getDashboardList(options) {
	var myOptions = getDocCustomGetOptions(options);

	return fetch(
		APP_CONST.API_HOST_AT + "/products/dashboard/602eb4222e3f11162ccdb0da",
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function updateDocType(item, options) {
	const { id = "" } = item;
	var myOptions = getDocCustomPutOptions(options, item);

	return fetch(APP_CONST.API_HOST_AT + "/doctype/" + id, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}
export function addNewDocType(newitem, options) {
	var myOptions = getDocCustomPostOptions(options, newitem);
	return fetch(APP_CONST.API_HOST_AT + "/doctype", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}
export function getDocTypeList(options = {}) {
	var myOptions = getDocCustomGetOptions(options);
	return fetch(APP_CONST.API_HOST_AT + "/doctype", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function updateUserProfile(newitem, options) {
	var myOptions = getDocCustomPostOptions(options, newitem);
	return fetch(
		APP_CONST.API_HOST_AT + "/users/profile/updateProfile",
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}
export function approveUser(newitem, options) {
	const { value = 0 } = newitem.selected;
	let ypdatedStaus = Object.assign({
		...newitem.user,
		roles: [value],
	});
	var myOptions = getDocCustomPostOptions(options, ypdatedStaus);

	return fetch(APP_CONST.API_HOST_AT + "/users/profile/updateStatus", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getUserList(options) {
	var url = APP_CONST.API_HOST_AT + "/users/list";
	var myOptions = getDocCustomGetOptions(options);
	return fetch(url, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function loginUser(newitem) {
	return fetch(APP_CONST.API_HOST_AT + "/auth/email/login", {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newitem),
	})
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function registerUser(newitem) {
	return fetch(APP_CONST.API_HOST_AT + "/auth/email/register", {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newitem),
	})
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getDocCategoryList(options = {}) {
	var myOptions = getDocCustomGetOptions(options);
	return fetch(APP_CONST.API_HOST_AT + "/doccategory", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function getDocRequestList(options = {}, id) {
	var myOptions = getDocCustomGetOptions(options);
	return fetch(APP_CONST.API_HOST_AT + "/docrequests/request/" + id, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function getDocRequestApprovalList(options = {}, id) {
	var myOptions = getDocCustomGetOptions(options);
	return fetch(APP_CONST.API_HOST_AT + "/docrequests/approval/" + id, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function getDocIssuanceList(options = {}, id) {
	var myOptions = getDocCustomGetOptions(options);
	return fetch(APP_CONST.API_HOST_AT + "/docrequests/issuance/" + id, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function getDocIssuancetakeoutList(options = {}, id) {
	var myOptions = getDocCustomGetOptions(options);
	return fetch(
		APP_CONST.API_HOST_AT + "/docrequests/takeoutissuance/" + id,
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function initiateApprovalHistory(options, newitem) {
	let newReq = {
		history: JSON.stringify(newitem),
		updated_by: newitem.empl_id,
		updated_on: new Date(),
		mode_of_access: "initial",
		request_no: newitem.request_no,
		page_from: newitem.page_from,
	};
	var myOptions = getDocCustomPostOptions(options, newReq);
	return fetch(
		APP_CONST.API_HOST_AT + "/docrequests/initiateApprovalHistory",
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function loadApproavalAccessUserInfo(item, options = {}) {
	const { access, emp_id } = item;
	var myOptions = getDocCustomGetOptions(options.auth);
	return fetch(
		APP_CONST.API_HOST_AT + "/users/checkApproval/" + emp_id.toString(),
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function loadDocumentforTakeOutList(item, options) {
	var myOptions = getDocCustomPostOptions(options, item);

	return fetch(
		APP_CONST.API_HOST_AT + "/products/takeOutRequest/" , 
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getDocDepartmentList(options = {}) {
	var myOptions = getDocCustomGetOptions(options);
	return fetch(APP_CONST.API_HOST_AT + "/docdepartments", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function updateDoc(item, options) {
	var myOptions = getDocCustomPutOptions(options, item);

	const { id = "" } = item;
	return fetch(APP_CONST.API_HOST_AT + "/products/" + id, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}
export function destructDocument(options, params) {
	var myOptions = getDocCustomPostOptions(options, params);
 
	return fetch(
		APP_CONST.API_HOST_AT + "/products/destructDoc",
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function addNewDoc(newitem, options) {
	var myOptions = getDocCustomPostOptions(options, newitem);
	return fetch(APP_CONST.API_HOST_AT + "/products", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getNewQrCode(newitem,options) {
	var myOptions = getDocCustomPostOptions(options, newitem);
	return fetch(APP_CONST.API_HOST_AT + "/products/qrcode/getRandomCode",myOptions )
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((dtatus) => {
			return dtatus;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getDocumentList(options, { userId = "" }) {
	var myOptions = getDocCustomGetOptions(options);

	return fetch(APP_CONST.API_HOST_AT + "/products/created/" + userId, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getIssuedDocumentList(options, { userId = "" }) {
	var myOptions = getDocCustomGetOptions(options);

	return fetch(APP_CONST.API_HOST_AT + "/products/issued/" + userId, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getLogSheet(options, params) {
	var myOptions = getDocCustomPostOptions(options, params);

	return fetch(APP_CONST.API_HOST_AT + "/products/logSheets", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getAuditLog(options, params) {
	var myOptions = getDocCustomPostOptions(options, params);

	return fetch(APP_CONST.API_HOST_AT + "/products/auditLog", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function getDestructiveList(options, params) {
	var myOptions = getDocCustomPostOptions(options, params);

	return fetch(
		APP_CONST.API_HOST_AT + "/products/destructiveDocList",
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function getBoxList(options) {
	var myOptions = getDocCustomGetOptions(options);

	return fetch(APP_CONST.API_HOST_AT + "/box", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getRacks(id,options) {
	var myOptions = getDocCustomPostOptions(options, {rack:id});
	return fetch( 
		APP_CONST.API_HOST_AT + "/box/racks/getRacksN",myOptions 
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}

export function getCountOf(item,options) {
	var myOptions = getDocCustomPostOptions(options, item);
	return fetch( 
		APP_CONST.API_HOST_AT + "/products/getCountOfDoc/getCountOfDoc",myOptions 
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			handleError(error);
		});
}
export function updateBox(item, options) {
	var myOptions = getDocCustomPutOptions(options, item);
	const { id = "" } = item;
	return fetch(APP_CONST.API_HOST_AT + "/box/" + id, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function addNewBox(newitem, options) {
	var myOptions = getDocCustomPostOptions(options, newitem);

	return fetch(APP_CONST.API_HOST_AT + "/box", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function updateDocCat(item, options) {
	const { id = "" } = item;
	var myOptions = getDocCustomPutOptions(options, item);

	return fetch(APP_CONST.API_HOST_AT + "/doccategory/" + id, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function addNewDocCat(newitem, options) {
	var myOptions = getDocCustomPostOptions(options, newitem);
	return fetch(APP_CONST.API_HOST_AT + "/doccategory", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function updateDocDept(item, options) {
	const { id = "" } = item;
	var myOptions = getDocCustomPutOptions(options, item);

	return fetch(APP_CONST.API_HOST_AT + "/docdepartments/" + id, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function addNewDocDept(newitem, options) {
	var myOptions = getDocCustomPostOptions(options, newitem);
	return fetch(APP_CONST.API_HOST_AT + "/docdepartments", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function addNewDocumentRequest(newitem, options) {
	const { doc_requested_doctype: { id = "0" } = {} } = newitem; 
	const typeofReq = id === "6" ? "takeout" : "n-takeout";
	var myOptions = getDocCustomPostOptions(options, newitem);
	return fetch(APP_CONST.API_HOST_AT + "/docrequests/", myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function updateDocumentRequest(item, options) {
	const { id = "" } = item;
	var myOptions = getDocCustomPutOptions(options, item);
	return fetch(APP_CONST.API_HOST_AT + "/docrequests/" + id, myOptions)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function approveDocumentRequest(item, options) {
	const { id = "" } = item;
	var myOptions = getDocCustomPutOptions(options, item);
	return fetch(
		APP_CONST.API_HOST_AT + "/docrequests/approve/" + id + "/" + options.emp_id,
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

export function issueGenaralIssuance(item, options) {
	const { id = "" } = item;
	var myOptions = getDocCustomPutOptions(options, item);
	return fetch(
		APP_CONST.API_HOST_AT +
			"/docrequests/issueGenaralIssuance/" +
			id +
			"/" +
			options.emp_id,
		myOptions
	)
		.then((response) => {
			if (!response.ok) {
				handleResponseError(response);
			}
			return response.json();
		})
		.catch((error) => {
			handleError(error);
		});
}

function handleResponseError(response) {
	throw new Error("HTTP error, status = " + response.status);
}

function handleError(error) {
	console.log(error.message);
}

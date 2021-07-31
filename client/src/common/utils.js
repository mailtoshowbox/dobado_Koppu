import APP_CONST from "./contant";

export function getDocCustomGetOptions(options) {
    const myHeaders = new Headers();
    var bearer = `bearer ${options.access_token}`;
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', bearer);
    return {
        mode: "cors",
        method: 'GET',
        headers: myHeaders
    }
}

export function getDocCustomPostOptions(options, newitem) {

    const myHeaders = new Headers();
    var bearer = `bearer ${options.auth.access_token}`;
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', bearer);
    //delete options.auth;

    return {
        mode: "cors",
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            ...newitem
        })
    }
}

export function getDocCustomPutOptions(options, newitem) {

    const myHeaders = new Headers();
    var bearer = `bearer ${options.auth.access_token}`;
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', bearer);
    //delete options.auth;
    return {
        mode: "cors",
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify({
            ...newitem
        })
    }
}

export function docRequestDocumentType(cell, row) {
    const dcat1 = APP_CONST.DOC_REQUEST_DOC_TYPE.CATEGORY_ONE;
    const dcat2 = APP_CONST.DOC_REQUEST_DOC_TYPE.CATEGORY_TWO;
    const dcat3 = APP_CONST.DOC_REQUEST_DOC_TYPE.CATEGORY_THREE;

    let docTypeSelected = dcat1;
    if (cell <= 3) {
        docTypeSelected = dcat1;
    } else if (cell > 3 && cell <= 5) {
        docTypeSelected = dcat2;
    } else if (cell > 5) {
        docTypeSelected = dcat3;
    }

    return docTypeSelected.filter((td) => {
        return td.id === cell;
    })[0]["name"];
};


export function uniqueId(prefix = 'id') {
    return prefix + '' + Date.now().toString(36).substr(2, 9).toUpperCase();
}
export function diableFIeldForEdit(prefix = 'id') {
    return 'disable-edit-field';
}

export function setRequestStatus(cell, row) {

    const {
        rejectDocumentRequest: {
            is_rejected = false
        },
    } = cell;
    return is_rejected ? "doc-request-rejected text-danger" : "";
};

export function getDocRequestStatus(row) {
    const {
        approval = []
    } = row;

    let stsus = 0;
    if (approval.length > 0) {
        approval.forEach((appr) => {
            if (appr.status === "pending") {
                stsus = 1;
            } else if (appr.status === "approved") {
                stsus = 2;
            } else if (appr.status === "rejected") {
                stsus = 3;
            }
        });
    }

    return stsus;
};
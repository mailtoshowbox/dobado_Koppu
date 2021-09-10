const APP_CONST = {
    API_HOST_AT: "http://localhost:3000",
    "REQUEST_DOCUMENT_PREFIX": "RQ",
    "REQUEST_DOCUMENT_PREFIX_RECU": "RQ",
    "DOC_REQUEST_DOC_TYPE": {
        CATEGORY_ONE: [{
                id: "1",
                name: "Executed Copy"
            },
            {
                id: "2",
                name: "Controlled Copy"
            },
            {
                id: "3",
                name: "Add Docs"
            },
        ],
        CATEGORY_TWO: [{
                id: "4",
                name: "UC Copy"
            },
            {
                id: "5",
                name: "Add Docs"
            },
        ],
        CATEGORY_THREE: [{
            id: "6",
            name: "Take Out"
        }],
    },"EXPORT_CSV_COLUMN":
        [
        {"FIELD_LABEL" : 'Req No', "FIELD_NAME":"document_request_info.document_request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Ref No', "FIELD_NAME":"document_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Doc No', "FIELD_NAME":"document_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Doc title', "FIELD_NAME":"name", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Doc type', "FIELD_NAME":"document_type" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Desc', "FIELD_NAME":"description", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Dept', "FIELD_NAME":"document_request_info.department", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Issued on ', "FIELD_NAME":"document_request_info.document_issued_on" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Issued to', "FIELD_NAME":"document_request_info.document_issued_to" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Issued by', "FIELD_NAME":"document_request_info.document_issued_by" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Sub on', "FIELD_NAME":"document_request_info.document_submitted_on" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Sub by', "FIELD_NAME":"document_request_info.document_submitted_by", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Reason', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'R By', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'R on', "FIELD_NAME":"request_no" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'S loc', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'TO by', "FIELD_NAME":"request_no" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'To be dest', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Dest on', "FIELD_NAME":"request_no", "FIELD_VALUE":true }
    ]
}

export default APP_CONST;
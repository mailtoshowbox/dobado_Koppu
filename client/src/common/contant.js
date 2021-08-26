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
        {"FIELD_LABEL" : 'Request No', "FIELD_NAME":"document_request_info.document_request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Reference number', "FIELD_NAME":"document_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Document No', "FIELD_NAME":"document_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Document title', "FIELD_NAME":"name", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Document type', "FIELD_NAME":"document_type" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Description', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Department', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Issued on ', "FIELD_NAME":"document_request_info.document_issued_on" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Issued to', "FIELD_NAME":"document_request_info.document_issued_to" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Issued by', "FIELD_NAME":"document_request_info.document_issued_by" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Submitted on', "FIELD_NAME":"request_no" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Submitted by', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Reason for submission', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Received By', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Received on', "FIELD_NAME":"request_no" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'Storage location', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Take out by', "FIELD_NAME":"request_no" , "FIELD_VALUE":true},
        {"FIELD_LABEL" : 'To be destructed', "FIELD_NAME":"request_no", "FIELD_VALUE":true },
        {"FIELD_LABEL" : 'Destructed on', "FIELD_NAME":"request_no", "FIELD_VALUE":true }
    ]
}

export default APP_CONST;
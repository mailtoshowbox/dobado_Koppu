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
    },
    "EXPORT_CSV_COLUMN":
        [
            { "FIELD_LABEL": 'Req No', "FIELD_NAME": "document_request_info.document_request_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Ref No', "FIELD_NAME": "document_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Doc No', "FIELD_NAME": "document_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Doc title', "FIELD_NAME": "name", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Doc type', "FIELD_NAME": "document_type", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Desc', "FIELD_NAME": "description", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Dept', "FIELD_NAME": "document_request_info.department", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Issued on ', "FIELD_NAME": "document_request_info.document_issued_on", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Issued to', "FIELD_NAME": "document_request_info.document_issued_to", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Issued by', "FIELD_NAME": "document_request_info.document_issued_by", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Sub on', "FIELD_NAME": "document_request_info.document_submitted_on", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Sub by', "FIELD_NAME": "document_request_info.document_submitted_by", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Reason', "FIELD_NAME": "reason_for_request", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'R By', "FIELD_NAME": "request_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'R on', "FIELD_NAME": "request_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'S loc', "FIELD_NAME": "Location", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'TO by', "FIELD_NAME": "request_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'To be dest', "FIELD_NAME": "To be destruct", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Dest on', "FIELD_NAME": "Destructed On", "FIELD_VALUE": true }
        ], "EXPORT_PDF_COLUMN_LOG_SHEET":
        [
            { "FIELD_LABEL": 'Req No', "PDF_VIEW": true, "FIELD_NAME": "document_request_info.document_request_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Ref No', "PDF_VIEW": true, "FIELD_NAME": "rdocument_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Doc No', "PDF_VIEW": true, "FIELD_NAME": "document_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Doc title', "PDF_VIEW": true, "FIELD_NAME": "name", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Doc type', "PDF_VIEW": true, "FIELD_NAME": "document_type", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Desc', "PDF_VIEW": true, "FIELD_NAME": "description", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Dept', "PDF_VIEW": true, "FIELD_NAME": "document_request_info.department", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Issued on ', "PDF_VIEW": true, "FIELD_NAME": "document_request_info.document_issued_on", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Issued to', "FIELD_NAME": "document_request_info.document_issued_to", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Issued by', "FIELD_NAME": "document_request_info.document_issued_by", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Sub on', "FIELD_NAME": "document_request_info.document_submitted_on", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Sub by', "FIELD_NAME": "document_request_info.document_submitted_by", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Reason', "FIELD_NAME": "reason", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'R By', "FIELD_NAME": "rby", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'R on', "FIELD_NAME": "ron", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'S loc', "FIELD_NAME": "slov", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'TO by', "FIELD_NAME": "toby", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'To be dest', "FIELD_NAME": "to be dest", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Dest on', "FIELD_NAME": "dest on", "FIELD_VALUE": true }
        ], "EXPORT_PDF_COLUMN_AUDIT_LOG":
        [
            { "FIELD_LABEL": 'Title', "FIELD_NAME": "name", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Ref No', "FIELD_NAME": "document_no", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Category', "FIELD_NAME": "document_category_details", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Modifier Name', "FIELD_NAME": "updatedBy", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Created On', "FIELD_NAME": "createdOn", "FIELD_VALUE": true },
            { "FIELD_LABEL": 'Modified on', "FIELD_NAME": "updatedOn", "FIELD_VALUE": true }
        ],
    "EXPORT_PDF_COLUMN_AUDIT_LOG_FILE_NAME": "AUDIT -" + new Date(),
    "EXPORT_PDF_COLUMN_AUDIT_LOG_NAME": "AUDIT -" + new Date()
    ,
    "EXPORT_PDF_COLUMN_LOG_SHEET_FILE_NAME": "LOG S -" + new Date(),
    "EXPORT_PDF_COLUMN_LOG_SHEET_NAME": "LOG S -" + new Date()
}

export default APP_CONST;
// export const base = "http://192.168.33.10/lms/backend/web/"
export const base = "http://lms-development.interactive-yogi.com/web/"

export const accountType = {
    'search' : 'account-type/'
}

export const dashboard = {
    'buyer-count' : "dashboard/buyer-count",
    'lead-count' : "dashboard/leads-count",
    'lead-by-type' : "dashboard/lead-by-type",
    'vendor-count' : "dashboard/vendor-count",
    'alerts' : "dashboard/alerts",
    'pending' : "dashboard/lead-pending",
    "failed" : "dashboard/lead-failed",
    'failed-vendor': "dashboard/lead-failed-vendor",
    'declined': 'dashboard/lead-declined',
    'unsold': 'dashboard/lead-unsold'
}

export const verticals = {
    'search' : "vertical/search/",
    'create' : 'vertical/create-new-vertical/',
    'update' : 'vertical/update-vertical/',
    'delete' : 'vertical/delete/',
    'fields' : 'vertical/vertical-field-names/',
    'offers' : 'vertical/get-offers/',
    'filter' : 'vertical/filter-columns/'
}

export const verticalFieldDefinitions = {
    'search' : 'vertical-field-definitions/',
    'create' : 'vertical-field-definitions/create-new-vertical-mapping/',
    'update' : 'vertical-field-definitions/update-required/',
    'update-ping' : 'vertical-field-definitions/update-required-ping',
    'delete' : 'vertical-field-definitions/delete-field/',
    'mapping' : 'vertical-field-definitions/mapping/',
    'update-post' : 'vertical-field-definitions/update-required-post'
}

export const verticalDuplicateChecks = {
    'search' : 'vertical-duplicate-check/get-duplicates/',
    'create' : 'vertical-duplicate-check/create-new/',
    'update' : 'vertical-duplicate-check/update-check/',
    'delete' : 'vertical-duplicate-check/delete-field/',
}

export const offers = {
    'search' : 'offer/',
    'create' : 'offer/create/',
    'update' : 'offer/update/',
    'delete' : 'offer/delete/', 
    'display' : 'offer/offers-by-id/' 
}

export const buyer = {
    'search' : 'buyer/search',
    'create' : 'buyer/create/',
    'update' : 'buyer/update-buyer/',
    'delete' : 'buyer/delete-buyer/',
    'add'    : 'buyer/add-buyer',
    'leads'  : 'buyer/search-leads',
    'status' : 'buyer/buyer-with-po',
    'filter' : 'buyer/filter-columns',
    'display': 'buyer/display-mapping',
    'display_zipcodes': 'buyer/display-zip-codes',
    'response': 'buyer/buyer-response',
    'alerts': 'buyer/buyer-alerts',
    'buyer-vendors' : 'buyer/get-buyer-vendors',
    'buyer-vendors-delete' : 'buyer/delete-buyer-vendors',
    'buyer-delivery-response': 'buyer-delivery-response?sort=-timestamp',
    'buyer-delivery-response-filter': 'buyer-delivery-response/filter-columns',
    'buyer-custom-format': 'buyer/buyer-custom-format'
}

export const buyerVerticals = {
    'search' : 'buyer-verticals/search',
    'add': "buyer-verticals/add-buyer-vertial"
}

export const vendor = {
    'search' : 'vendor/search/',
    'create' : 'vendor/create/',
    'update' : 'vendor/update-vendor/',
    'delete' : 'vendor/delete/',
    'add'    : 'vendor/add-vendor',
}


export const fieldDefinitions = {
    'search' : 'field-definitions/',
    'create' : 'field-definitions/create-new/',
    'update' : 'field-definitions/update/',
    'delete' : 'field-definitions/delete-field/',
}

export const universalFieldDefinitions = {
    'search' : 'universal-field-definitions/',
    'create' : 'universal-field-definitions/create-new/',
    'delete' : 'field-definitions/delete-field/'
}

export const processQueue = {
    'search' : 'queue/'
}

export const leadsData = {
    'search' : 'lead-data/lead-data-by-buyer',
    'by-id'  : 'lead-data/lead-data-by-id',
    'update' : 'lead-data/lead-update',
    'updateData' : 'lead-data/lead-update-field'
}

export const leads = {
    'all'    : 'leads/get-all-leads',
    'update' : 'leads/update-lead',
    'sold'   : 'leads/get-sold-leads',
    'search' : 'leads/search',
    'filter' : 'lead-table-pivot/filter-columns/',
    'id'     : 'leads/get-lead',
    'manual' : 'leads/manually-load-leads',
    'send-file': 'leads/manually-upload-leads',
    'get-submit-files': 'leads/get-file-names-submit',
    'get-processed-files': 'leads/get-file-names-processed',
    'delete-process-file' : 'leads/delete-process-file',
    'pivot'  : 'lead-table-pivot/get-all',
    'pivot-sold' : 'lead-table-pivot/recently-sold',
    'pivot-vertical' : 'lead-table-pivot/vertical',
    'pivot-lead' : 'lead-table-pivot/by-lead-id',
    'status' : 'leads-status/',
    'status-id': 'leads/get-status-by-id',
    'by-id' : 'leads/lead-by-id',
    'direct-sell' : "leads/direct-sell",
    'return-lead' : 'leads/return-lead',
    'update-status' : "leads/update-lead-status",
    'update-qccomments': 'leads/update-qc-comments',
    'get-return-lead' : 'leads/get-return-lead',
    'get-by-order': "lead-table-pivot/get-by-order",
    'check-sell' : "leads/check-sell-lead",
    'bulk' : 'leads/handle-bulk-operations',
    'stack' : 'lead-stack-trace?sort=-timestamp',
    'stack-id' : 'lead-stack-trace/find-by-id',
    'stack-filter' : 'lead-stack-trace/filter-columns',
    'buyer-leads' : 'leads/buyer-leads',
    'buyer-leads-export': 'leads/pull-buyer-lead-data',
    'buyer-leads-verticals': 'leads/buyer-verticals',
    'delivery-example' : 'leads/delivery-post-example',
    'delivery-test-search': 'leads/delivery-test-search',
    'format-post-values' : 'leads/format-post-values'
}

export const order = {
    'search' : 'orders/search/',
    'create' : 'orders/create-order/',
    'update' : 'orders/update-order/',
    'delete' : 'orders/delete/',
    'all'    : 'orders/get-all-orders/',
    'filter' : 'orders/filter-columns/' ,
    'sort'   : 'orders/sort-columns/',
    'by-id'  : 'orders/order-by-id',
    'vertical': 'orders/get-vertical-orders',
    'delete-vertical': 'orders/delete-vertical-order'
}

export const zipcodes = {
    'distance' : 'us-zipcodes/all-by-distance/',
    'state' : "us-zipcodes/all-by-state/",
    'city' : "us-zipcodes/zip-by-city/",
}

export const buyerZipCodes = {
    'distance' : 'zip-codes/add-zipcodes-distance',
    'state' : 'zip-codes/add-zipcodes-state',
    'manual' : 'zip-codes/add-zipcodes-manual',
    'update' : 'zip-codes/update-zipcodes',
    'delete' : 'zip-codes/delete-zip-codes',
    'delete-all' : 'zip-codes/delete-all-zip-codes',
    'delete-state': 'zip-codes/delete-zip-codes-state',
    'search' : 'zip-codes/get-zip-codes',
    'update-all' : 'zip-codes/update-all-zipcodes',
    'search-state': 'zip-codes/get-zip-codes-states'
}

export const buyerFieldDefinitions = {
    'add' : 'buyer-field-definitions/add-new-mapped-fields',
    'update' : 'buyer-field-definitions/update-mapped-fields',
    'buyer'  : 'buyer-field-definitions/mapped-fields-by-buyer',
    'custom' : 'buyer-field-definitions/mapped-fields-by-custom',
    'delete' : 'buyer-field-definitions/delete-mapped-fields'
}

export const account = {
    'login' : 'user/login',
    'accountCreation' : 'user/create-account',
    'verify' : 'user/account-exists/',
    'update' : 'user/update-password',
    'retrieve': 'user/get-users',
    'adminUpdate': 'user/update-password-admin',
    'externalID': 'user/account-external-id'
}

export const buyerDelivery = {
    'all' : 'buyer-delivery/search-all',
    'vertical' : 'buyer-delivery/search-vertical',
    'update' : 'buyer-delivery/update-delivery',
    'delete' : 'buyer-delivery/delete-delivery',
    'delivery-manual' : 'buyer/add-delivery-manual'

}

export const reports = {
    'vendor' : 'reports/vendor-report',
    'lead-data': 'reports/pull-lead-data',
    'alert' : 'alerts/search',
    'alert-dashboard' : 'alerts/dashboard-search',
    'alert-all': 'alerts/',
    'alert-filter': 'alerts/filter-columns',
    'alert-update': '/alerts/update-alert',
    'lead-by-id': 'reports/export-by-id',
    'buyer' : 'reports/buyer-report',
    'buyer-vendor-report' : 'reports/buyer-vendor-report'
}
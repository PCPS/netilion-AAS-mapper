export type NetilionAssetId = number;

export interface NetilionPagination {
    total_count: number;
    page_count: number;
    per_page: number;
    page: number;
    prev?: string;
    next?: string;
    first?: string;
    last?: string;
}
export interface NetilionBatchResponseBase {
    pagination: NetilionPagination;
}

export interface NetilionBatchResponseAsset extends NetilionBatchResponseBase {
    assets: Array<NetilionAsset>;
}
export interface NetilionBatchResponseProduct
    extends NetilionBatchResponseBase {
    products: Array<NetilionProduct>;
}
export interface NetilionBatchResponseDocument
    extends NetilionBatchResponseBase {
    documents: Array<NetilionDocument>;
}
export interface NetilionBatchResponseSoftware
    extends NetilionBatchResponseBase {
    softwares: Array<NetilionSoftware>;
}

export interface NetilionBatchResponseDocumentCategory {
    categories: Array<NetilionDocumentCategory>;
    pagination: NetilionPagination;
}
export interface NetilionBatchResponseProductCategory {
    categories: Array<NetilionProductCategory>;
    pagination: NetilionPagination;
}

export type NetilionBatchable =
    | NetilionAsset
    | NetilionProduct
    | NetilionDocument
    | NetilionSoftware
    | NetilionDocumentCategory
    | NetilionProductCategory;

export type NetilionBatchResponse<T extends NetilionBatchable> =
    T extends NetilionAsset
        ? NetilionBatchResponseAsset
        : T extends NetilionProduct
        ? NetilionBatchResponseProduct
        : T extends NetilionDocument
        ? NetilionBatchResponseDocument
        : T extends NetilionSoftware
        ? NetilionBatchResponseSoftware
        : T extends NetilionDocumentCategory
        ? NetilionBatchResponseDocumentCategory
        : T extends NetilionProductCategory
        ? NetilionBatchResponseProductCategory
        : NetilionBatchResponseBase;

export type NetilionBatchItem<T extends NetilionBatchResponseBase> =
    T extends NetilionBatchResponseAsset
        ? NetilionAsset
        : T extends NetilionBatchResponseProduct
        ? NetilionProduct
        : T extends NetilionBatchResponseDocument
        ? NetilionDocument
        : T extends NetilionBatchResponseSoftware
        ? NetilionSoftware
        : T extends NetilionBatchResponseDocumentCategory
        ? NetilionDocumentCategory
        : T extends NetilionBatchResponseProductCategory
        ? NetilionProductCategory
        : never;

export interface NetilionLink {
    href: string;
}

export interface NetilionReference {
    id: number;
    href: string;
}

export interface NetilionLineItem {
    product_id?: number;
    product_code?: string;
    quantity?: number;
    href?: string;
}

export interface NetilionAttachment {
    id: number;
    type: string;
    file_name: string;
    fingerprint: string;
    content_author: string;
    content_version: string;
    content_date: string;
    content_type: string;
    remarks: string;
    document: NetilionReference | NetilionDocument;
    languages: Array<string>;
    download_href: string;
    created_at: string;
    updated_at: string;
}

export interface NetilionDocumentStatus extends NetilionStatus_tenant {}

export interface NetilionDocumentCategory {
    code?: string;
    name: string;
    description?: string;
    id: number;
    parent?: NetilionReference | NetilionDocumentCategory;
    tenant: NetilionReference | NetilionTenant;
    links?: {
        documents?: NetilionLink | Array<NetilionDocument>;
        standards?: NetilionLink; // Lab
    };
}

export interface NetilionDocumentClassification {
    code?: string;
    name: string;
    description?: string;
    id: number;
    tenant: NetilionReference | NetilionTenant;
}

export interface NetilionDocument {
    name: string;
    description?: string;
    number?: string;
    document_version?: string;
    valid_from?: string;
    valid_until?: string;
    id: number;
    source?: string;
    classification: NetilionReference | NetilionDocumentClassification;
    status: NetilionReference | NetilionDocumentStatus;
    tenant?: NetilionReference | NetilionTenant;
    download_href?: string;
    links: {
        attachments?: NetilionLink | Array<NetilionAttachment>;
        categories?: NetilionLink | Array<NetilionDocumentCategory>;
        assets?: NetilionLink | Array<NetilionAsset>;
        bill_of_materials?: NetilionLink | Array<NetilionBillOfMaterial>;
        events?: NetilionLink | Array<NetilionEvent>;
        deliveries?: NetilionLink | Array<NetilionDelivery>;
        products?: NetilionLink | Array<NetilionProduct>;
        instrumentations?: NetilionLink | Array<NetilionInstrumenation>;
        nodes?: NetilionLink | Array<NetilionNode>;
        purchase_orders?: NetilionLink | Array<NetilionPurchaseOrder>;
        quotations?: NetilionLink | Array<NetilionQuotation>;
        request_for_quotations?:
            | NetilionLink
            | Array<NetilionRequestForQuotation>;
    };
}

export interface NetilionHealthConditionRemedy {
    code: string;
    description: string;
    id: number;
}

export interface NetilionHealthConditionCause {
    code: string;
    description: string;
    id: number;
    links?: {
        remedies?: NetilionLink | Array<NetilionHealthConditionRemedy>;
    };
}

export interface NetilionStatus_nocode {
    code?: string;
    name: string;
    description?: string;
    id: number;
    tenant?: NetilionReference | NetilionTenant;
}

export interface NetilionStatus_code extends NetilionStatus_nocode {
    code: string;
}

export interface NetilionStatus_tenant extends NetilionStatus_nocode {
    tenant: NetilionReference | NetilionTenant;
}

export interface NetilionSparePartStatus {
    order_code?: string;
    name: string;
    description?: string;
    id: number;
    tenant?: NetilionReference | NetilionTenant;
}

export interface NetilionCompany {
    name: string;
    description?: string;
    parent?: NetilionReference | NetilionCompany;
    id: number;
    tenant: NetilionReference | NetilionTenant;
    address?: {
        street: string;
        street_number?: string;
        zip_code: string;
        city: string;
        region_code?: string;
        country_code: string;
        phone?: string;
        company_name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        country_name?: string;
    };
}

export interface NetilionTenant {
    name: string;
    description: string;
    id: number;
    public: boolean;
}

export interface NetilionDeliveryStatus extends NetilionStatus_tenant {}

export interface NetilionDelivery {
    number: string;
    name?: string;
    customer_number?: string;
    description?: string;
    date_of_shipment?: string;
    id: number;
    sender?: NetilionReference; // Find what these are
    receiver?: NetilionReference; // Find what these are
    status: NetilionReference | NetilionDeliveryStatus;
    products?: [
        {
            product_id: number;
            product_code: string;
            quantity: number;
            href: string;
            assets?: [
                {
                    asset_id?: number;
                    serial_number?: string;
                    href?: string;
                }
            ];
        }
    ];
    links?: {
        assets?: NetilionLink | Array<NetilionAsset>;
        documents: NetilionLink; // Find what the interface for the resolved link is.
        purchase_orders: NetilionLink | Array<NetilionPurchaseOrder>;
    };
}

export interface NetilionPurchaseOrderStatus extends NetilionStatus_nocode {}

export interface NetilionPurchaseOrder {
    number: string;
    customer_number?: string;
    customer_purchase_order_number?: string;
    name?: string;
    date?: string;
    description: string;
    status: NetilionReference | NetilionPurchaseOrderStatus;
    sender?: NetilionReference; // Find what these are
    receiver?: NetilionReference; // Find what these are
    quotation?: NetilionReference | NetilionQuotation;
    id: number;
    line_items?: Array<NetilionLineItem>;
    links?: {
        products?: NetilionLink | Array<NetilionProduct>;
        deliveries?: NetilionLink | Array<NetilionDelivery>;
        documents?: NetilionLink | Array<NetilionDocument>;
    };
}

export interface NetilionHealthCondtionRule {
    type: string;
    bit?: number;
    start_bit?: number;
    end_bit?: number;
    value?: number;
}

export interface NetilionQuotationStatus extends NetilionStatus_tenant {}

export interface NetilionQuotation {
    number: string;
    name: string;
    date?: string;
    description?: string;
    id: number;
    status: NetilionReference | NetilionQuotationStatus;
    sender: NetilionReference; // Find what these are
    receiver: NetilionReference; // Find what these are
    line_items?: Array<NetilionLineItem>;
    links?: {
        products?: NetilionLink | Array<NetilionProduct>;
        purchase_orders?: NetilionLink | Array<NetilionPurchaseOrder>;
        documents?: NetilionLink | Array<NetilionDocument>;
    };
}

export interface NetilionAssetStatus extends NetilionStatus_code {}

export interface NetilionProductHealthCondition {
    diagnosis_code: string;
    protocol: string;
    protocol_version: string;
    device_ident?: string;
    product_identifier?: string;
    hidden?: boolean;
    rules?: Array<NetilionHealthCondtionRule>;
    asset_status: NetilionReference | NetilionAssetStatus;
    tenant?: NetilionReference | NetilionTenant;
    id: number;
    links?: {
        causes?: NetilionLink | Array<NetilionHealthConditionCause>;
    };
}

export interface NetilionSparePartType {
    code?: string;
    name: string;
    description?: string;
    id: number;
    tenant: NetilionReference | NetilionTenant;
    parent?: NetilionReference | NetilionSparePartType;
}

export interface NetilionSparePart {
    order_code: string;
    name: string;
    description?: string;
    id: number;
    status: NetilionReference | NetilionSparePartStatus;
    type: NetilionReference | NetilionSparePartType;
    tenant: NetilionReference | NetilionTenant;
    links?: {
        documents?: NetilionLink | Array<NetilionDocument>;
    };
}

export interface NetilionProductStatus extends NetilionStatus_code {}

export interface NetilionProduct {
    product_code: string;
    name?: string;
    description?: string;
    phase_out_date?: string;
    order_stop_date?: string;
    spare_parts_until?: string;
    spare_sensors_until?: string;
    repair_until?: string;
    calibration_until?: string;
    risk_of_maintainability?: string;
    id: number;
    status: NetilionReference | NetilionProductStatus;
    manufacturer: NetilionReference | NetilionCompany;
    parent?: NetilionReference | NetilionProduct;
    tenant?: NetilionReference | NetilionTenant;
    maintenance_advices?: [string];
    links?: {
        purchase_orders?: NetilionLink | Array<NetilionPurchaseOrder>;
        quotations?: NetilionLink | Array<NetilionQuotation>;
        categories?: NetilionLink | Array<NetilionProductCategory>;
        documents?: NetilionLink | Array<NetilionDocument>;
        pictures?: NetilionLink; // Find what the interface for the resolved link is.
        specifications?: NetilionLink | NetilionSpecification;
        health_conditions?:
            | NetilionLink
            | Array<NetilionProductHealthCondition>;
        softwares?: NetilionLink | Array<NetilionSoftware>;
        spare_parts?: NetilionLink | Array<NetilionSparePart>;
    };
}

export interface NetilionProductConfiguration {
    id: number;
    href: string;
    feature_key: string;
    description?: string;
    options?: [
        {
            id: number;
            href: string;
            option_key: string;
            description?: string;
        }
    ];
}

export interface NetilionProductVariant {
    variant_code: string;
    id: number;
    product: {
        id: number;
        href: string;
    };
    links?: {
        configurations?: NetilionLink | Array<NetilionProductConfiguration>;
    };
}

export interface NetilionAssetHealthCondition {
    diagnosis_code: string;
    id: number;
    asset_status: NetilionReference | NetilionAssetStatus;
    channel?: string;
    module?: string;
    links?: {
        causes?: NetilionLink | Array<NetilionHealthConditionCause>;
    };
}

export interface NetilionInstrumenationStatus extends NetilionStatus_tenant {}

export interface NetilionInstrumenationType {
    code?: string;
    name: string;
    description?: string;
    id: number;
    tenant: NetilionReference | NetilionTenant;
    parent?: NetilionReference | NetilionInstrumenationType;
}

export interface NetilionRequestForQuotationStatus
    extends NetilionStatus_tenant {}

export interface NetilionRequestForQuotation {
    number: string;
    name: string;
    date?: string;
    author?: string;
    description?: string;
    status: NetilionReference | NetilionRequestForQuotationStatus;
    sender: NetilionReference; // Find what these are
    receiver: NetilionReference; // Find what these are
    id: number;
    links?: {
        bill_of_materials?: NetilionLink | Array<NetilionBillOfMaterial>;
        documents?: NetilionLink | Array<NetilionDocument>;
    };
}

export interface NetilionBillOfMaterial {
    name: string;
    description?: string;
    date?: string;
    author?: string;
    id: number;
    links?: {
        instrumentations?: NetilionLink | Array<NetilionInstrumenation>;
        request_for_quotations?:
            | NetilionLink
            | Array<NetilionRequestForQuotation>;
        documents?: NetilionLink | Array<NetilionDocument>;
    };
}

export interface NetilionThreshold {
    id: number;
    name: string;
    description?: string;
    key: string;
    unit_id?: number;
    value: number;
    tolerance: number;
    threshold_type: string;
    notification: boolean;
}

export interface NetilionInstrumenation {
    tag: string;
    description?: string;
    criticality?: string;
    accessibility?: string;
    id: number;
    status: NetilionReference | NetilionInstrumenationStatus;
    type: NetilionReference | NetilionInstrumenationType;
    parent?: NetilionReference | NetilionInstrumenation;
    tenant?: NetilionReference | NetilionTenant;
    links?: {
        assets?: NetilionLink | Array<NetilionAsset>;
        bill_of_materials?: NetilionLink | Array<NetilionBillOfMaterial>;
        documents?: NetilionLink | Array<NetilionDocument>;
        nodes?: NetilionLink | Array<NetilionNode>;
        pictures?: NetilionLink; // Find what the interface for the resolved link is.
        specifications?: NetilionLink | NetilionSpecification;
        thresholds?: NetilionLink | Array<NetilionThreshold>;
    };
}

export interface NetilionNodeType {
    code?: string;
    name: string;
    description?: string;
    id: number;
    tenant: NetilionReference | NetilionTenant;
    parent?: NetilionReference | NetilionNodeType;
}

export interface NetilionNode {
    name: string;
    description?: string;
    hidden: boolean;
    id: number;
    type: NetilionReference | NetilionNodeType;
    parent?: NetilionReference | NetilionNode;
    tenant?: NetilionReference | NetilionTenant;
    links?: {
        instrumentations?: NetilionLink | Array<NetilionInstrumenation>;
        assets?: NetilionLink | Array<NetilionAsset>;
        documents?: NetilionLink | Array<NetilionDocument>;
        pictures?: NetilionLink; // Find what the interface for the resolved link is.
        specifications?: NetilionLink | NetilionSpecification;
        recipes?: NetilionLink; // Lab
    };
}

export interface NetilionEventStatus extends NetilionStatus_tenant {}

export interface NetilionEventType {
    code?: string;
    name: string;
    description?: string;
    deletable?: boolean;
    id: number;
    tenant: NetilionReference | NetilionTenant;
}

export interface NetilionEvent {
    name: string;
    description?: string;
    responsible?: string;
    start_datetime: string;
    end_datetime?: string;
    id: number;
    status: NetilionReference | NetilionEventStatus;
    type: NetilionReference | NetilionEventType;
    tenant?: NetilionReference | NetilionTenant;
    links?: {
        assets: NetilionLink | Array<NetilionAsset>;
        documents?: NetilionLink | Array<NetilionDocument>;
        instrumentations?: NetilionLink | Array<NetilionInstrumenation>;
        nodes?: NetilionLink | Array<NetilionNode>;
        specifications?: NetilionLink | NetilionSpecification;
    };
}

export interface NetilionAsset {
    serial_number: string;
    description?: string;
    production_date?: string;
    last_seen_at?: string;
    id: number;
    ownership_claimed?: boolean;
    created_at?: string;
    updated_at?: string;
    product: NetilionReference | NetilionProduct;
    product_variant?: NetilionReference | NetilionProductVariant;
    parent?: NetilionReference | NetilionAsset;
    status: NetilionReference | NetilionAssetStatus;
    tenant?: NetilionReference | NetilionTenant;
    links?: {
        documents?: NetilionLink | Array<NetilionDocument>;
        events?: NetilionLink | Array<NetilionEvent>;
        nodes?: NetilionLink | Array<NetilionNode>;
        instrumentations?: NetilionLink | Array<NetilionInstrumenation>;
        systems?: NetilionLink; // Lab
        pictures?: NetilionLink; // Find what the interface for the resolved link is.
        specifications?: NetilionLink | NetilionSpecification;
        subscriptions?: NetilionLink;
        api_subscriptions?: NetilionLink;
        health_conditions?: NetilionLink | Array<NetilionAssetHealthCondition>;
    };
}

export interface NetilionProductCategory {
    code?: string;
    name: string;
    description?: string;
    source_ref?: string;
    id: number;
    parent?: NetilionReference | NetilionProductCategory;
    tenant?: NetilionReference | NetilionTenant;
    links?: {
        products?: NetilionLink | Array<NetilionProduct>;
    };
}

export interface NetilionSoftware {
    id: number;
    version_number: string;
    name?: string;
    description?: string;
    tenant: NetilionReference | NetilionTenant;
    software_type: {
        id: number;
    };
    links: {
        software_attachments?: NetilionLink | Array<NetilionSoftwareAttachment>;
    };
}

export interface NetilionSoftwareAttachment {
    id: number;
    type: string;
    file_name?: string;
    fingerprint?: string;
    content_date?: string;
    remarks?: string;
    software: NetilionReference | NetilionSoftware;
    download_href: string;
}

export interface NetilionSpecificationProperty {
    value: string;
    unit: string;
    source_timestamp: string;
    updated_at: string;
    ui_visible: boolean;
}

export interface NetilionSpecification {
    [key: string]: NetilionSpecificationProperty;
}

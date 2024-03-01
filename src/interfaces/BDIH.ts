export type AssetIdType = string;

export interface Link {
    href: string; //The link
    resl: string; //The context of the link
}

export interface AssetShort {
    assetId: AssetIdType;
    serialNumber: string;
    orderCode: string;
    materialNumber: string;
    tag: string;
    name: string;
    links: Array<Link>;
}

export interface Asset {
    assetId: AssetIdType;
    serialNumber: string;
    orderCode: string;
    materialNumber: string;
    tag: string;
    name: string;
    createDate: string;
    firmwareVersion: string;
    yearOfConstruction: string;
    monthOfConstruction: string;
    assetCategory: string;
    manufacturer?: string;
    manufacturerCountry?: string;
    parent: AssetShort;
    children: Array<AssetShort>;
    links: Array<Link>;
}

export interface OrderCode {
    root: string;
    materialNumber: string;
    orderCode: string;
    orderCodeExtended: string;
    configurationId: string;
    measurementRucksackId: string;
    isSpecialProduct?: boolean;
    createDate: string;
    links: Array<Link>;
}

export interface Product {
    materialNumber: string;
    root: string;
    name: string;
    family: string;
    familyId: string;
    materialType: string;
    producingCompany: string;
    producingCompanyId: string;
    deviceType: string;
    deviceTypeId: string;
    status: string;
    statusId: string;
    productClass: string;
    configurable: boolean;
    orderCode: string;
    competitor: boolean;
    baseUnit: string;
    grossWeight: number;
    netWeight: number;
    systemModstamp: string;
    weightUnitId: string;
    productSegmentation: string;
    portfolioType: string;
    links: Array<Link>;
}

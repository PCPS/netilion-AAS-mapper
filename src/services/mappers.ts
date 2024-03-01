import { LangStringSet } from '../oi4_definitions/primitive_data_types';
import { xs } from '../oi4_definitions/xs_data_types';
import { NetilionAsset, NetilionAssetId } from '../interfaces/Netilion';
import { submodel_name } from '../agents/netilion_agent';
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

export function server_root_address(): string {
    return (
        process.env.SERVER_URL +
        (process.env.NODE_ENV !== 'production' ? ':' + process.env.PORT : '') +
        '/' +
        process.env.SERVER_API_VERSION
    );
}

export function netilionAssetIdToSubmodelId(
    asset_id: NetilionAssetId,
    sm_name: submodel_name
) {
    return (
        server_root_address() +
        '/mapper/shells/' +
        asset_id +
        '/submodels/' +
        sm_name
    );
}
export function netilionAssetIdToShellId(asset_id: NetilionAssetId) {
    if (isNaN(asset_id)) {
        throw 'Cannot convert NaN to Shell ID.';
    }
    return server_root_address() + '/mapper/shells/' + asset_id;
}

// Maps asset object retrieved from netilion to sufficeint input of the Namplate submodel generator function
export function netilionAssetToNameplateInput(opt: {
    asset: NetilionAsset;
    assetSpecs?: any;
    product: any;
    assetSoftwares?: any;
    manufacturer: any;
}) {
    let FirmwareVersion: LangStringSet | undefined;
    if (opt.assetSoftwares && opt.assetSoftwares.length) {
        FirmwareVersion = [
            {
                language: 'en',
                text: opt.assetSoftwares.find((element: any) => {
                    return element.software_type.id === 1;
                }).version_number
            }
        ];
    }
    let ManufacturerProductType: LangStringSet | undefined;
    let OrderCodeOfManufacturer: LangStringSet | undefined;
    if (opt.assetSpecs['eh.pcps.tmp.ordercode']?.value) {
        ManufacturerProductType = [
            {
                language: 'en',
                text: 'N/A'
            }
        ]; //is this right
        OrderCodeOfManufacturer = [
            {
                language: 'en',
                text: opt.assetSpecs['eh.pcps.tmp.ordercode'].value
            }
        ]; //should it be the same as type??
    }
    let DateOfManufacture: xs.date | undefined;
    if (opt.asset.production_date) {
        let date = opt.asset.production_date.split('-');
        let is_valid_date = date.every((item: any) => {
            if (typeof item != 'string') return false;
            return !isNaN(item as any) && !isNaN(parseFloat(item));
        });
        if (is_valid_date) {
            while (date.length < 3) {
                date.push('01');
            }
            let dateString = date.reduce((a: string, b: string) => a + '-' + b);
            DateOfManufacture = new xs.date(dateString);
        }
    }
    const nameplate_input = {
        URIOfTheProduct: 'de.endress.com/en/' + opt.product.product_code,
        ManufacturerName: [{ language: 'en', text: opt.manufacturer.name }],
        ManufacturerProductDesignation: [
            { language: 'en', text: opt.product.name }
        ],
        ContactInformation: {
            NationalCode: [{ language: 'en', text: 'de' }],
            CityTown: [{ language: 'de', text: 'Weil am Rhein' }],
            Street: [{ language: 'de', text: 'Colmarer Straße 6' }],
            Zipcode: [{ language: 'en', text: '79576' }]
        },
        ManufacturerProductRoot: [
            { language: 'en', text: opt.product.product_code }
        ],
        ManufacturerProductFamily: undefined,
        ManufacturerProductType, //is this right
        OrderCodeOfManufacturer, //should it be the same as type??
        ProductArticleNumberOfManufacturer: undefined,
        SerialNumber: opt.asset.serial_number,
        YearOfConstruction: 'N/A', //fix
        DateOfManufacture,
        HardwareVersion: undefined,
        FirmwareVersion: FirmwareVersion,
        SoftwareVersion: undefined,
        CountryOfOrigin: 'N/A', //fix
        CompanyLogo: undefined, //fix
        Markings: undefined, //fix
        AssetSpecificProperties: undefined //fix
    };
    return nameplate_input;
}

// Maps asset object retrieved from netilion to sufficeint input of the TechnicalData submodel generator function
export function netilionAssetToTechnicalDaataInput(opt: {
    asset: NetilionAsset;
    assetSpecs?: any;
    product: any;
    assetSoftwares?: any;
    manufacturer: any;
}) {
    const ManufacturerName = [{ language: 'en', text: opt.manufacturer }];
    const ManufacturerProductDesignation = [
        { language: 'en', text: opt.product.name }
    ];
    const ManufacturerArticleNumber = 'N/A'; // TODO: Find this
    const ManufacturerOrderCode = [
        {
            language: 'en',
            text: opt.assetSpecs['eh.pcps.tmp.ordercode']?.value || 'N/A'
        }
    ];

    const GeneralInfromation = {
        ManufacturerName,
        ManufacturerProductDesignation,
        ManufacturerArticleNumber,
        ManufacturerOrderCode
    };

    // TODO: What is this
    // const ProductClassifications: {
    //     ProductClassificationItem?: Array<{
    //         ProductClassificationSystem: string
    //         ClassificationSystemVersion?: string
    //         ProductClassId: string
    //     }>
    // }

    // TODO: What is this
    // const TechnincalProperties = {
    // };

    // TODO: What is this
    // const FurtherInformation?: {
    //     TextStatement?: Array<LangStringSet>
    //     ValidDate: xs.date
    // }

    const technical_data_input = {
        GeneralInfromation
        // ProductClassifications,
        // TechnicalProperties,
        // FurtherInformation
    };
    return technical_data_input;
}

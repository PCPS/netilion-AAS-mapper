import { LangStringSet } from '../oi4_definitions/primitive_data_types';
import { xs } from '../oi4_definitions/xs_data_types';

export function netilionAssetToNameplateInput(opt: {
    asset: any;
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
        URIOfTheProduct: 'endress.com/' + opt.product.product_code,
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

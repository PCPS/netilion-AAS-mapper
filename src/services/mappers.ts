import { LangStringSet } from '../oi4_definitions/primitive_data_types';
import { xs } from '../oi4_definitions/xs_data_types';

export function netilionAssetToNameplateInput(opt: {
    asset: any;
    assetSpecs?: any;
    product: any;
    assetSoftwares?: any;
    manufacturer: any;
}) {
    let firmwareVersion: LangStringSet | undefined;
    if (opt.assetSoftwares.softwares.length) {
        firmwareVersion = [
            {
                language: 'en',
                text: opt.assetSoftwares.softwares.find((element: any) => {
                    return element.software_type.id === 1;
                }).version_number
            }
        ];
    }
    let type: LangStringSet | undefined;
    let orderCode: LangStringSet | undefined;
    if (opt.assetSpecs['eh.pcps.tmp.ordercode']?.value) {
        type = [
            {
                language: 'en',
                text: 'N/A'
            }
        ]; //is this right
        orderCode = [
            {
                language: 'en',
                text: opt.assetSpecs['eh.pcps.tmp.ordercode'].value
            }
        ]; //should it be the same as type??
    }
    let manufacturingDate: xs.date | undefined;
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
            manufacturingDate = new xs.date(dateString);
        }
    }
    const nameplate_input = {
        id: opt.asset.id,
        uri: 'endress.com/' + opt.product.product_code,
        manufacturer: [{ language: 'en', text: opt.manufacturer.name }],
        shortDesignation: [{ language: 'en', text: opt.product.name }],
        contactInformation: {
            nationalCode: [{ language: 'en', text: 'de' }],
            cityTown: [{ language: 'de', text: 'Weil am Rhein' }],
            street: [{ language: 'de', text: 'Colmarer Straße 6' }],
            zipcode: [{ language: 'en', text: '79576' }]
        },
        root: [{ language: 'en', text: opt.product.product_code }],
        family: undefined,
        type, //is this right
        orderCode, //should it be the same as type??
        articleNumber: undefined,
        serialNumber: opt.asset.serial_number,
        constructionYear: 'N/A', //fix
        manufacturingDate,
        hardwareVersion: undefined,
        firmwareVersion,
        softwareVersion: undefined,
        countryOfOrigin: 'N/A', //fix
        companyLogo: undefined, //fix
        markings: undefined, //fix
        assetSpecificProperties: undefined //fix
    };
    return nameplate_input;
}

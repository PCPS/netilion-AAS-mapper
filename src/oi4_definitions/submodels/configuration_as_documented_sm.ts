import { Reference, SpecificAssetId, Submodel } from '../aas_components';
import {
    ContentType,
    DataTypeDefXsd,
    LangStringSet,
    PathType,
    ValueDataType,
    EntityType,
    Identifier,
    AasSubmodelElements
} from '../primitive_data_types';
import {
    SubmodelElementCollection,
    Property,
    MultiLanguageProperty,
    ReferenceElement,
    File,
    Entity
} from '../submodel_elements';
import { xs } from '../xs_data_types';
import { SubmodelElement } from '../aas_components';

export function Generate_SM_ConfigurationAsDocumented(
    opt: {
        NetilionAssetId: string;
        MinTemp: number;
        MaxTemp: number;
    },
    id: string,
    idShort_postfix?: string
): Submodel {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const NetilionAssetId = new Property({
        idShort: 'NetilionAssetId',
        valueType: 'xs:string',
        value: opt.NetilionAssetId.toString()
    });
    submodelElements.push(NetilionAssetId);
    const MinTemp = new Property({
        idShort: 'MinTemp',
        valueType: 'xs:decimal',
        value: opt.MinTemp.toString()
    });
    submodelElements.push(MinTemp);
    const MaxTemp = new Property({
        idShort: 'MaxTemp',
        valueType: 'xs:decimal',
        value: opt.MaxTemp.toString()
    });
    submodelElements.push(MaxTemp);
    const result = new Submodel({
        id: id,
        idShort: 'ConfigurationAsDocumented' + postfix,
        submodelElements: submodelElements
    });
    return result;
}

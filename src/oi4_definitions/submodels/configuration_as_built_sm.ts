import { Reference, SpecificAssetId, Submodel } from '../aas_components';
import {
    ContentType,
    DataTypeDefXsd,
    LangStringSet,
    PathType,
    ValueDataType,
    EntityType,
    Identifier
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
import { GetSemanticId } from '../../services/oi4_helpers';
import { number_to_padded_string } from '../../services/oi4_helpers';

export function Generate_SM_ConfigurationAsBuilt(
    opt: {
        NetilionAssetId: string;
        MinTemp: number;
        MaxTemp: number;
    },
    id: string,
    idShort_postfix?: string
): Submodel {
    let postfix = idShort_postfix || '';
    let submodelElements: Array<SubmodelElement> = [];
    const NetilionAssetId = new Property({
        idShort: 'NetilionAssetId',
        semanticId: GetSemanticId('NetilionAssetId'),
        valueType: 'xs:string',
        value: opt.NetilionAssetId
    });
    submodelElements.push(NetilionAssetId);
    const MinTemp = new Property({
        idShort: 'MinTemp',
        semanticId: GetSemanticId('MinTemp'),
        valueType: 'xs:decimal',
        value: opt.MinTemp
    });
    submodelElements.push(MinTemp);
    const MaxTemp = new Property({
        idShort: 'MaxTemp',
        semanticId: GetSemanticId('MaxTemp'),
        valueType: 'xs:decimal',
        value: opt.MaxTemp
    });
    submodelElements.push(MaxTemp);
    const result = new Submodel({
        id: id,
        idShort: 'ConfigurationAsBuilt' + postfix,
        semanticId: GetSemanticId('ConfigurationAsBuilt'),
        submodelElements: submodelElements
    });
    return result;
}

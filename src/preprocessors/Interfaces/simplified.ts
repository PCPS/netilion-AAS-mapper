import {
    AasReferables,
    DataTypeDefXsd,
    ValueDataType
} from '../../oi4_definitions/primitive_data_types';

/////////////////////
//CountTypes:      //
//-----------------//
//  ! = 1          //
//  ? = [0-1]      //
//  + = [1-*]      //
//  * = [0-*]      //
/////////////////////
export type CountType = '!' | '?' | '+' | '*';

export interface Model {
    semanticId?: string;
    semanticIdType?: 'IRDI' | 'IRI';
    alias?: string;
    modelType: AasReferables;
    count: CountType;
}

export interface SmModel extends Model {
    modelType: 'Submodel';
    submodelElements: { [prop: string]: Model };
}

export interface SmeModel extends Model {
    modelType: 'SubmodelElementCollection';
    value: { [prop: string]: Model };
}

export interface PropertyModel extends Model {
    modelType: 'Property';
    valueType: DataTypeDefXsd;
}

export interface MlpModel extends Model {
    modelType: 'MultiLanguageProperty';
}

export interface ReferenceElementModel extends Model {
    modelType: 'ReferenceElement';
}

export interface FileModel extends Model {
    modelType: 'File';
}

export interface EntityModel extends Model {
    modelType: 'Entity';
}

export interface ArbitraryModel extends Model {
    [prop: string]: string | undefined;
}

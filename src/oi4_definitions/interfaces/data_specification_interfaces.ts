import { Reference, ValueList } from '../aas_components';
import {
    LangStringSet,
    DataTypeIEC61360,
    LevelType
} from '../primitive_data_types';

/** Definition of recommended DataSpecification templates and a DataspecificationTemplatetType to denote which template is used. */
namespace DataSpecificationTemplateInterfaces {
    export type ConstantPropertyDataType =
        | 'DATE'
        | 'STRING'
        | 'INTEGER_MEASURE'
        | 'INTEGER_COUNT'
        | 'INTEGER_CURRENCY'
        | 'REAL_MEASURE'
        | 'REAL_COUNT'
        | 'REAL_CURRENCY'
        | 'BOOLEAN'
        | 'RATIONAL'
        | 'RATIONAL_MEASURE'
        | 'TIME'
        | 'TIMESTAMP';

    export type VariablePropertyDataType = ConstantPropertyDataType;

    export type ParameterPropertyDataType = ConstantPropertyDataType;

    export type MultiLanguagePropertyDataType = 'STRING_TRANSLATABLE';

    export type RangeDataType =
        | 'INTEGER_MEASURE'
        | 'INTEGER_COUNT'
        | 'INTEGER_CURRENCY'
        | 'REAL_MEASURE'
        | 'REAL_COUNT'
        | 'REAL_CURRENCY';

    export interface RangeLevelType {
        Min: true;
        Max: true;
    }

    export type ReferenceElementDataType = 'STRING' | 'IRI' | 'IRDI';

    export type FileDataType = 'FILE';

    export type BlobDataType = 'BLOB' | 'HTML';

    export interface I_DataSpecificationContent {}

    // a data specification template commonly used to provide semantics for units used in a data specification.
    export interface I_DataSpecificationPhysicalUnit
        extends I_DataSpecificationContent {
        unitName: string;
        unitSymbol: string;
        definition: LangStringSet;
        siNotion?: string;
        siName?: string;
        dinNotion?: string;
        eceName?: string;
        eceCode?: string;
        nistName?: string;
        sourceOfDefinition?: string;
        conversionFator?: string;
        registrationAuthorityId?: string;
        supplier?: string;
    }

    /** a data specification template commonly used to provide semantics for AAS standard elements.
     * All of the following DataSpecification content templates are derived from this one.
     */
    export interface I_DataSpecificationIec61360
        extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName?: LangStringSet;
        unit?: string;
        unitId?: Reference;
        sourceOfDefinition?: string;
        symbol?: string;
        dataType?: DataTypeIEC61360;
        definition?: LangStringSet;
        valueFormt?: string;
        valueList?: ValueList;
        value?: string;
        levelType?: LevelType;
    }

    export interface I_ConstantProperty extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        unit: string;
        unitId: Reference;
        sourceOfDefinition?: string;
        symbol?: string;
        dataType: ConstantPropertyDataType;
        definition: LangStringSet;
        valueFormt?: string;
        value: string;
    }

    export interface I_VariableProperty extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        unit: string;
        unitId: Reference;
        sourceOfDefinition?: string;
        symbol?: string;
        dataType: VariablePropertyDataType;
        definition: LangStringSet;
        valueFormt?: string;
        valueList?: ValueList;
    }

    export interface I_ParameterProperty extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        unit: string;
        unitId: Reference;
        sourceOfDefinition?: string;
        symbol?: string;
        dataType: ParameterPropertyDataType;
        definition: LangStringSet;
        valueFormt?: string;
        valueList?: ValueList;
    }

    export interface I_MultiLanguageProperty
        extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType: MultiLanguagePropertyDataType;
        definition: LangStringSet;
    }

    export interface I_Range extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType: RangeDataType;
        definition: LangStringSet;
        valueFormt?: string;
        levelType?: RangeLevelType;
    }

    export interface I_ReferenceElement extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType?: ReferenceElementDataType;
        definition: LangStringSet;
    }

    export interface I_File extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType?: FileDataType;
        definition: LangStringSet;
    }

    export interface I_Blob extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType?: BlobDataType;
        definition: LangStringSet;
    }

    export interface I_Capability extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        definition: LangStringSet;
    }

    export interface I_RelationshipElement extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        definition: LangStringSet;
    }

    export interface I_AnnotatedRelationshipElement
        extends I_DataSpecificationContent {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        definition: LangStringSet;
    }

    export type I_DataSpecificationTemplateType =
        | 'DataSpecificationPhysicalUnit'
        | 'DataSpecificationIec61360'
        | 'ConstantProperty'
        | 'VariableProperty'
        | 'ParameterProperty'
        | 'MultiLanguageProperty'
        | 'Range'
        | 'ReferenceElement'
        | 'File'
        | 'Blob'
        | 'Capability'
        | 'RelationshipElement'
        | 'AnnotatedRelationshipElement';
}

export = DataSpecificationTemplateInterfaces;

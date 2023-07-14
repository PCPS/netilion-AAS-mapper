import {
    DataSpecification,
    Reference,
    ValueList
} from '../oi4_definitions/aas_components';
import {
    LangStringSet,
    DataTypeIEC61360,
    LevelType
} from '../oi4_definitions/primitive_data_types';

namespace DataSpecificationInput {
    type ConstantPropertyDataType =
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

    type VariablePropertyDataType = ConstantPropertyDataType;

    type ParameterPropertyDataType = ConstantPropertyDataType;

    type MultiLanguagePropertyDataType = 'STRING_TRANSLATABLE';

    type RangeDataType =
        | 'INTEGER_MEASURE'
        | 'INTEGER_COUNT'
        | 'INTEGER_CURRENCY'
        | 'REAL_MEASURE'
        | 'REAL_COUNT'
        | 'REAL_CURRENCY';

    interface RangeLevelType {
        Min: true;
        Max: true;
    }

    type ReferenceElementDataType = 'STRING' | 'IRI' | 'IRDI';

    type FileDataType = 'FILE';

    type BlobDataType = 'BLOB' | 'HTML';

    export interface ConstantProperty {
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

    export interface VariableProperty {
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

    export interface ParameterProperty {
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

    export interface MultiLanguageProperty {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType: MultiLanguagePropertyDataType;
        definition: LangStringSet;
    }

    export interface Range {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType: RangeDataType;
        definition: LangStringSet;
        valueFormt?: string;
        levelType?: RangeLevelType;
    }

    export interface ReferenceElement {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType?: ReferenceElementDataType;
        definition: LangStringSet;
    }

    export interface File {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType?: FileDataType;
        definition: LangStringSet;
    }

    export interface Blob {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType?: BlobDataType;
        definition: LangStringSet;
    }

    export interface Capability {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        definition: LangStringSet;
    }

    export interface RelationshipElement {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        definition: LangStringSet;
    }

    export interface AnnotatedRelationshipElement {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        definition: LangStringSet;
    }
}

export = DataSpecificationInput;

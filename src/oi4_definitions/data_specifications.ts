import {
    BlobDataType,
    ConstantPropertyDataType,
    FileDataType,
    I_AnnotatedRelationshipElement,
    I_Blob,
    I_Capability,
    I_ConstantProperty,
    I_DataSpecificationIec61360,
    I_DataSpecificationPhysicalUnit,
    I_File,
    I_MultiLanguageProperty,
    I_ParameterProperty,
    I_Range,
    I_ReferenceElement,
    I_RelationshipElement,
    I_VariableProperty,
    MultiLanguagePropertyDataType,
    ParameterPropertyDataType,
    RangeDataType,
    RangeLevelType,
    ReferenceElementDataType,
    VariablePropertyDataType
} from './interfaces/data_specification_interfaces';
import { Reference, ValueList } from './aas_components';
import {
    DataTypeIEC61360,
    LangStringSet,
    LevelType
} from './primitive_data_types';

namespace DataSpecificationTemplates {
    export abstract class DataSpecificationContent {
        abstract readonly modelName:
            | 'DataSpecificationPhysicalUnit'
            | 'DataSpecificationIec61360';
    }

    export class DataSpecificationPhysicalUnit
        extends DataSpecificationContent
        implements I_DataSpecificationPhysicalUnit
    {
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
        readonly modelName = 'DataSpecificationPhysicalUnit';
        public constructor(opt: I_DataSpecificationPhysicalUnit) {
            super();
            this.unitName = opt.unitName;
            this.unitSymbol = opt.unitSymbol;
            this.definition = opt.definition;
            this.siNotion = opt.siNotion;
            this.siName = opt.siName;
            this.dinNotion = opt.dinNotion;
            this.eceName = opt.eceName;
            this.eceCode = opt.eceCode;
            this.nistName = opt.nistName;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.conversionFator = opt.conversionFator;
            this.registrationAuthorityId = opt.registrationAuthorityId;
            this.supplier = opt.supplier;
        }
    }

    export class DataSpecificationIec61360
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
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
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_DataSpecificationIec61360) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.unit = opt.unit;
            this.unitId = opt.unitId;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.symbol = opt.symbol;
            this.dataType = opt.dataType;
            this.definition = opt.definition;
            this.valueFormt = opt.valueFormt;
            this.valueList = opt.valueList;
            this.value = opt.value;
            this.levelType = opt.levelType;
        }
    }

    export class ConstantProperty
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
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
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_ConstantProperty) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.unit = opt.unit;
            this.unitId = opt.unitId;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.symbol = opt.symbol;
            this.dataType = opt.dataType;
            this.definition = opt.definition;
            this.valueFormt = opt.valueFormt;
            this.value = opt.value;
        }
    }

    export class VariableProperty
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
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
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_VariableProperty) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.unit = opt.unit;
            this.unitId = opt.unitId;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.symbol = opt.symbol;
            this.dataType = opt.dataType;
            this.definition = opt.definition;
            this.valueFormt = opt.valueFormt;
            this.valueList = opt.valueList;
        }
    }

    export class ParameterProperty
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
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
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_ParameterProperty) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.unit = opt.unit;
            this.unitId = opt.unitId;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.symbol = opt.symbol;
            this.dataType = opt.dataType;
            this.definition = opt.definition;
            this.valueFormt = opt.valueFormt;
        }
    }

    export class MultiLanguageProperty
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType: MultiLanguagePropertyDataType;
        definition: LangStringSet;
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_MultiLanguageProperty) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.dataType = opt.dataType;
            this.definition = opt.definition;
        }
    }

    export class Range
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType: RangeDataType;
        definition: LangStringSet;
        valueFormt?: string;
        levelType?: RangeLevelType;
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_Range) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.dataType = opt.dataType;
            this.definition = opt.definition;
            this.valueFormt = opt.valueFormt;
            this.levelType = opt.levelType;
        }
    }

    export class ReferenceElement
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType?: ReferenceElementDataType;
        definition: LangStringSet;
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_ReferenceElement) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.dataType = opt.dataType;
            this.definition = opt.definition;
        }
    }

    export class File
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType?: FileDataType;
        definition: LangStringSet;
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_File) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.dataType = opt.dataType;
            this.definition = opt.definition;
        }
    }

    export class Blob
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        dataType?: BlobDataType;
        definition: LangStringSet;
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_Blob) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.dataType = opt.dataType;
            this.definition = opt.definition;
        }
    }

    export class Capability
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        definition: LangStringSet;
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_Capability) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.definition = opt.definition;
        }
    }

    export class RelationshipElement
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        definition: LangStringSet;
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_RelationshipElement) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.definition = opt.definition;
        }
    }

    export class AnnotatedRelationshipElement
        extends DataSpecificationContent
        implements I_DataSpecificationIec61360
    {
        preferredName: LangStringSet;
        shortName: LangStringSet;
        sourceOfDefinition?: string;
        definition: LangStringSet;
        readonly modelName = 'DataSpecificationIec61360';
        public constructor(opt: I_AnnotatedRelationshipElement) {
            super();
            this.preferredName = opt.preferredName;
            this.shortName = opt.shortName;
            this.sourceOfDefinition = opt.sourceOfDefinition;
            this.definition = opt.definition;
        }
    }
}

export = DataSpecificationTemplates;

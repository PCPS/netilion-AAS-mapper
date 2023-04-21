export interface langString {
    language: string;
    text: string;
}

export interface LangStringSet extends Array<langString> {}

export interface ContentType {
    mediaType: string;
    subType: string;
}

export class BlobType {
    private _buffer: Buffer;
    public constructor(opt: { buffer: Buffer | string }) {
        this._buffer = Buffer.from(opt.buffer);
    }
    get buffer(): Buffer {
        return Buffer.from(this._buffer);
    }
    set buffer(buffer: Buffer | string) {
        this._buffer = Buffer.from(buffer);
    }
    public toJSON() {
        return this._buffer.toString('base64');
    }
}

export type Identifier = string;

export type PathType = string;

export type QualifierType = string;

export type ValueDataType = any;

export type ElementCategory = 'CONSTANT' | 'PARAMETER' | 'VARIABLE';

export type ConceptDescriptionCategory =
    | 'APPLICATION_CLASS'
    | 'CAPABILITY'
    | 'COLLECTION'
    | 'DOCUMENT'
    | 'ENTITY'
    | 'EVENT'
    | 'FUNCTION'
    | 'PROPERTY'
    | 'VALUE'
    | 'RANGE'
    | 'QUALIFIER_TYPE'
    | 'REFERENCE'
    | 'RELATIONSHIP';

export type ModelingKind = 'Template' | 'Instance';

export type QualifierKind =
    | 'ValueQualifier'
    | 'ConceptQualifier'
    | 'TemplateQualifier';

export type decimalBuildInTypes =
    | 'xs:integer'
    | 'xs:long'
    | 'xs:int'
    | 'xs:short'
    | 'xs:byte'
    | 'xs:nonNegativeInteger'
    | 'xs:positiveInteger'
    | 'xs:unsignedLong'
    | 'xs:unsignedInt'
    | 'xs:unsignedShort'
    | 'xs:unsignedByte'
    | 'xs:nonPositiveInteger'
    | 'xs:negativeInteger';

export type durationBuildInTypes =
    | 'xs:daytimeDuration'
    | 'xs:yearMonthDuration';

export type PrimitiveTypes =
    | 'xs:anyURI'
    | 'xs:base64Binary'
    | 'xs:boolean'
    | 'xs:date'
    | 'xs:dateTime'
    | 'xs:dateTimeStamp'
    | 'xs:decimal'
    | 'xs:double'
    | 'xs:duration'
    | 'xs:float'
    | 'xs:gDay'
    | 'xs:gMonth'
    | 'xs:gMonthDay'
    | 'xs:gYear'
    | 'xs:gYearMonth'
    | 'xs:hexBinary'
    | 'xs:string'
    | 'xs:time';

export type DataTypeDefXsd =
    | decimalBuildInTypes
    | durationBuildInTypes
    | PrimitiveTypes;

export type AssetKind = 'Type' | 'Instance';

export interface Resource {
    path: PathType;
    contentType?: ContentType;
}

export type ReferenceTypes = 'GlobalReference' | 'ModelReference';

export type AasSubmodelElements =
    | 'AnnotatedRelationshipElement'
    | 'BasicEventElement'
    | 'Blob'
    | 'Capability'
    | 'DataElement'
    | 'Entity'
    | 'EventElement'
    | 'File'
    | 'MultiLanguageProperty'
    | 'Property'
    | 'Operation'
    | 'Range'
    | 'RelationshipElement'
    | 'ReferenceElement'
    | 'SubmodelElement'
    | 'SubmodelElementCollection'
    | 'SubmodelElementList';

export type AasIdentifiables =
    | 'AssetAdministrationShell'
    | 'ConceptDescription'
    | 'Identifiable'
    | 'Submodel';

export type GenericGloballyIdentifiables = 'GlobalReference';

export type GenericFragnmentKeys = 'FragmentReference';

export type GloballyIdentifiables =
    | GenericGloballyIdentifiables
    | AasIdentifiables;

export type AasReferableNonIdentifiables = AasSubmodelElements;

export type FragmentKeys = GenericFragnmentKeys | AasReferableNonIdentifiables;

export type AasReferables = AasIdentifiables | AasReferableNonIdentifiables;

export type KeyTypes = FragmentKeys | AasReferables | GloballyIdentifiables;

export interface Key {
    type: KeyTypes;
    value: string;
}

export type Direction = 'input' | 'output';

export type StateOfEvent = 'on' | 'off';

export type EntityType = 'CoManagedEntity' | ' SelfManagedEntity';

export abstract class DataSpecificationContent {}

export type DataTypeIEC61360 =
    | 'DATE'
    | 'STRING'
    | 'STRING_TRANSLATABLE'
    | 'INTEGER_MEASURE'
    | 'INTEGER_COUNT'
    | 'INTEGER_CURRENCY'
    | 'REAL_MEASURE'
    | 'REAL_COUNT'
    | 'REAL_CURRENCY'
    | 'BOOLEAN'
    | 'IRI'
    | 'IRDI'
    | 'RATIONAL'
    | 'RATIONAL_MEASURE'
    | 'TIME'
    | 'TIMESTAMP'
    | 'HTML'
    | 'BLOB'
    | 'FILE';

export type LevelType = 'Min' | 'Max' | 'Nom' | 'Typ';
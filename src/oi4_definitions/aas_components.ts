import {
    LangStringSet,
    Identifier,
    QualifierType,
    ValueDataType,
    ValuedElementCategory,
    ModellingKind,
    QualifierKind,
    DataTypeDefXsd,
    DataTypeDefRdf,
    AssetKind,
    Resource,
    Key,
    ReferenceTypes,
    DataSpecificationContent,
    DataTypeIEC61360,
    LevelType,
    MultiLanguageTextType,
    NameType,
    MultiLanguageNameType,
    LableType,
    VersionType,
    RevisionType,
    ConceptDescriptionCategory,
    CategoryType
} from './primitive_data_types';
import { Mixin } from 'ts-mixer';
import { logger } from '../services/logger';
import { Serialize } from '../services/oi4_helpers';

export class Reference {
    public type: ReferenceTypes;
    public referredSemanticId?: Reference;
    public keys: Array<Key>;
    public constructor(opt: {
        type: ReferenceTypes;
        refferedSemanticId?: Reference;
        keys: Array<Key>;
    }) {
        this.type = opt.type;
        this.referredSemanticId = opt.refferedSemanticId;
        if (opt.keys.length > 0) {
            let keys: Array<Key> = [];
            opt.keys.forEach((value) => {
                let k: Key = { type: value.type, value: value.value };
                keys.push(k);
            });
            this.keys = keys;
        } else {
            this.keys = [];
            logger.error(
                'Reference object cannot be initialized withiout at least one key'
            );
        }
    }
}

export abstract class HasSemantics {
    semanticId?: Reference;
    supplementalSemanticIds?: Array<Reference>;
    public constructor(opt?: {
        semanticId?: Reference;
        supplementalSemanticIds?: Array<Reference>;
    }) {
        if (opt) {
            this.semanticId = opt.semanticId;
            if (opt.supplementalSemanticIds) {
                let supplementalSemanticIds: Array<Reference> = [];
                if (opt.supplementalSemanticIds.length > 0) {
                    opt.supplementalSemanticIds.forEach((val) =>
                        supplementalSemanticIds.push(val)
                    );
                }
                this.supplementalSemanticIds = supplementalSemanticIds;
            }
        }
    }
}

export class Extension extends HasSemantics {
    public name: NameType;
    public valueType?: DataTypeDefXsd | DataTypeDefRdf;
    public value?: ValueDataType;
    public refersTo?: Referable;
    public constructor(opt: {
        semanticId?: Reference;
        supplementalSemanticIds?: Array<Reference>;
        name: NameType;
        valueType?: DataTypeDefXsd | DataTypeDefRdf;
        value?: any;
        refersTo?: Referable; //can be local object or URI/ID. if local object, assign. if URI/ID, create local object and assign
    }) {
        super(opt);
        this.name = opt.name;
        this.valueType = opt.valueType;
        if (opt.value) {
            if (!opt.valueType) {
                this.valueType = 'xs:string';
            }
        }
        this.value = opt.value;
        this.refersTo = opt.refersTo;
    }
}

export abstract class HasExtension {
    public extentions?: Array<Extension>;
    public constructor(opt?: { extensions?: Array<Extension> }) {
        if (opt && opt.extensions) {
            if (opt.extensions.length > 0) {
                let extentions: Array<Extension> = [];
                opt.extensions.forEach((extention: Extension) => {
                    extentions.push(
                        new Extension({
                            name: extention.name,
                            valueType: extention.valueType,
                            value: extention.value,
                            refersTo: extention.refersTo
                        })
                    );
                });
                this.extentions = extentions;
            }
        }
    }
}

export abstract class Referable extends HasExtension {
    public category?: ValuedElementCategory | string;
    public idShort?: NameType;
    public displayName?: MultiLanguageNameType;
    public descriptoin?: MultiLanguageTextType;
    public constructor(opt?: {
        extensions?: Array<Extension>;
        category?: ValuedElementCategory | NameType;
        idShort?: NameType;
        displayName?: MultiLanguageNameType;
        description?: MultiLanguageTextType;
    }) {
        super(opt);
        this.category = opt?.category;
        this.idShort = opt?.idShort;
        this.displayName = opt?.displayName;
        this.descriptoin = opt?.description;
    }
}

export abstract class HasDataSpecification {
    public dataSpecifications?: Array<Reference>;
    public constructor(opt?: { dataSpecifications?: Array<Reference> }) {
        if (opt && opt.dataSpecifications) {
            let dataSpecifications: Array<Reference> = [];
            if (opt.dataSpecifications.length > 0) {
                opt.dataSpecifications.forEach((val) =>
                    dataSpecifications.push(val)
                );
            }
            this.dataSpecifications = dataSpecifications;
        }
    }
}

export interface ValueReferencePair {
    value: string;
    valueId: Reference;
}

export type ValueList = Array<ValueReferencePair>;

export class DataSpecificationIEC61360 extends DataSpecificationContent {
    public preferredName: LangStringSet;
    public shortName?: LangStringSet;
    public unit?: string;
    public unitId?: Reference;
    public sourceOfDefinition?: string;
    public symbol?: string;
    public dataType?: DataTypeIEC61360;
    public definition?: LangStringSet;
    public valueFormt?: string;
    public valueList?: ValueList;
    public value?: string;
    public levelType?: LevelType;
    public constructor(opt: {
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
    }) {
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

export class DataSpecificationPhysicalUnit extends DataSpecificationContent {
    public unitName: string;
    public unitSymbol: string;
    public definition: LangStringSet;
    public siNotion?: string;
    public siName?: string;
    public dinNotion?: string;
    public eceName?: string;
    public eceCode?: string;
    public nistName?: string;
    public sourceOfDefinition?: string;
    public conversionFator?: string;
    public registrationAuthorityId?: string;
    public supplier?: string;
    public constructor(opt: {
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
    }) {
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

export class DataSpecification {
    public administration?: AdministrativeInformation;
    public id: Identifier;
    public dataSpecificationContent: DataSpecificationContent;
    public description: LangStringSet;
    public constructor(opt: {
        administration?: AdministrativeInformation;
        id: Identifier;
        dataSpecificationContent: DataSpecificationContent;
        description: MultiLanguageTextType;
    }) {
        this.administration = opt.administration;
        this.id = opt.id;
        this.dataSpecificationContent = opt.dataSpecificationContent;
        this.description = opt.description;
    }
}

export class EmbeddedDataSpecification {}

export class AdministrativeInformation extends HasDataSpecification {
    public version?: VersionType;
    public revision?: RevisionType;
    public creator?: Reference;
    public templateId?: Identifier;
    public constructor(opt?: {
        dataSpecifications?: Array<Reference>;
        version?: VersionType;
        revision?: RevisionType;
        creator?: Reference;
        templateId?: Identifier;
    }) {
        super(opt);
        this.version = opt?.version;
        this.revision = opt?.revision;
        this.creator = opt?.creator;
        this.templateId = opt?.templateId;
    }
}

export abstract class Identifiable extends Referable {
    public id: string; //should be an IRI/IDRI/CustomID
    public administration?: AdministrativeInformation;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: CategoryType | string;
        idShort?: NameType;
        displayName?: LangStringSet;
        description?: LangStringSet;
        id: string;
        administration?: AdministrativeInformation;
    }) {
        super(opt);
        this.id = opt.id;
        this.administration = opt.administration;
    }
}

export abstract class HasKind {
    public kind: ModellingKind = 'Instance';
    public constructor(opt?: { kind?: ModellingKind }) {
        if (opt && opt.kind) {
            this.kind = opt.kind;
        }
    }
}

export class Qualifier extends HasSemantics {
    public kind: QualifierKind = 'ConceptQualifier';
    public type: QualifierType;
    public valueType: DataTypeDefXsd | DataTypeDefRdf;
    public value?: ValueDataType;
    public valueId?: Reference;
    public constructor(opt: {
        semanticId?: Reference;
        supplementalSemanticIds?: Array<Reference>;
        kind?: QualifierKind;
        type: QualifierType;
        valueType: DataTypeDefXsd | DataTypeDefRdf;
        value?: ValueDataType;
        valueId?: Reference;
    }) {
        super(opt);
        if (opt.kind) {
            this.kind = opt.kind;
        }
        this.type = opt.type;
        this.valueType = opt.valueType;
        this.value = opt.value;
        this.valueId = opt.valueId;
    }
}

export abstract class Qualifiable {
    public qualifiers?: Array<Qualifier>;
    public constructor(opt?: { qualifiers?: Array<Qualifier> }) {
        if (opt && opt.qualifiers) {
            let qualifiers: Array<Qualifier> = [];
            if (opt.qualifiers.length > 0) {
                opt.qualifiers.forEach((qualifier) =>
                    qualifiers.push(qualifier)
                );
            }
            this.qualifiers = qualifiers;
        }
    }
}

export abstract class SubmodelElement extends Mixin(
    Referable,
    HasSemantics,
    Qualifiable,
    HasDataSpecification
) {
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ValuedElementCategory | string;
        idShort?: NameType;
        displayName?: LangStringSet;
        description?: LangStringSet;
        semanticId?: Reference;
        supplementalSemanticIds?: Array<Reference>;
        qualifiers?: Array<Qualifier>;
        dataSpecifications?: Array<Reference>;
    }) {
        super(opt);
    }
} //TODO: must define different subclasses of submodelElement (e.g. event)

export class Submodel extends Mixin(
    Identifiable,
    HasKind,
    HasSemantics,
    Qualifiable,
    HasDataSpecification
) {
    readonly modelType: string = 'Submodel';

    public submodelElements?: Array<SubmodelElement>;
    public constructor(opt?: {
        extensions?: Array<Extension>;
        category?: ValuedElementCategory | string;
        idShort?: NameType;
        displayName?: LangStringSet;
        description?: LangStringSet;
        id: string;
        administration?: AdministrativeInformation;
        kind?: ModellingKind;
        semanticId?: Reference;
        supplementalSemanticIds?: Array<Reference>;
        qualifiers?: Array<Qualifier>;
        dataSpecifications?: Array<Reference>;
        submodelElements?: Array<SubmodelElement>;
    }) {
        super(opt);
        if (opt && opt.submodelElements) {
            let submodelElements: Array<SubmodelElement> = [];
            if (opt.submodelElements.length > 0) {
                opt.submodelElements.forEach((submodelElement) =>
                    submodelElements.push(submodelElement)
                );
            }
            this.submodelElements = submodelElements;
        }
    }
}

export class SpecificAssetId extends HasSemantics {
    public name: LableType;
    public value: Identifier;
    public externalSubjectId?: Reference;
    public constructor(opt: {
        semanticId?: Reference;
        supplementalSemanticId?: Array<Reference>;
        name: LableType;
        value: Identifier;
        externalSubjectId?: Reference;
    }) {
        super(opt);
        this.name = opt.name;
        this.value = opt.value;
        this.externalSubjectId = opt.externalSubjectId;
    }
}

export class AssetInformation {
    public assetKind: AssetKind;
    public globalAssetId?: Identifier;
    public specificAssetIds?: Array<SpecificAssetId>;
    public assetType?: Identifier;
    public defaultThumbnail?: Resource;
    public constructor(opt: {
        assetKind: AssetKind;
        globalAssetId?: Identifier;
        specificAssetIds?: Array<SpecificAssetId>;
        assetType?: Identifier;
        defaultThumbnail?: Resource;
    }) {
        this.assetKind = opt.assetKind;
        this.globalAssetId = opt.globalAssetId;
        if (opt.specificAssetIds) {
            let specificAssetIds: Array<SpecificAssetId> = [];
            if (opt.specificAssetIds.length > 0) {
                opt.specificAssetIds.forEach((val) =>
                    specificAssetIds.push(val)
                );
            }
            this.specificAssetIds = specificAssetIds;
        }
        this.assetType = opt.assetType;
        this.defaultThumbnail = opt.defaultThumbnail;
    }
}

export class AssetAdministrationShell extends Mixin(
    Identifiable,
    HasDataSpecification
) {
    readonly modelType: string = 'AssetAdministrationShell';

    public derivedFrom?: Reference; //To AssetAdministerationShell
    public assetInformation: AssetInformation;
    public submodels?: Array<Reference>; //To Submodel
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ValuedElementCategory | string;
        idShort?: NameType;
        displayName?: LangStringSet;
        description?: LangStringSet;
        id: string;
        administration?: AdministrativeInformation;
        dataSpecifications?: Array<Reference>;
        derivedFrom?: Reference;
        assetInformation: AssetInformation;
        submodels?: Array<Reference>;
    }) {
        super(opt);
        this.derivedFrom = opt.derivedFrom;
        this.assetInformation = opt.assetInformation;
        if (opt.submodels) {
            let submodels: Array<Reference> = [];
            if (opt.submodels.length > 0) {
                opt.submodels.forEach((submodel) => submodels.push(submodel));
            }
            this.submodels = submodels;
        }
    }
}

export class ConceptDescription extends Mixin(
    Identifiable,
    HasDataSpecification
) {
    readonly modelType: string = 'ConceptDescription';

    public isCaseOf?: Array<Reference>;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ConceptDescriptionCategory;
        idShort?: NameType;
        displayName?: LangStringSet;
        description?: LangStringSet;
        id: string;
        administration?: AdministrativeInformation;
        dataSpecifications?: Array<Reference>;
        isCaseOf?: Array<Reference>;
    }) {
        super(opt);
        if (opt.isCaseOf) {
            let isCaseOf: Array<Reference> = [];
            if (opt.isCaseOf.length > 0) {
                opt.isCaseOf.forEach((item) => isCaseOf.push(item));
            }
            this.isCaseOf = isCaseOf;
        }
    }
    // public serialize(): Object {
    //     return Serialize(this, {dataSpecifications: (obj: Object)=>{return undefined}}, {embeddedDataSpecification: (obj: Object)=>{return GetEmbeddedDataSpec(obj: Object)}});
    // }
}

class Environment extends Reference {
    public assetAdminstrationShells?: Array<AssetAdministrationShell>;
    public submodels?: Array<Submodel>;
    public conceptDescriptions?: Array<ConceptDescription>;
    public constructor(opt: {
        type: ReferenceTypes;
        refferedSemanticId?: Reference;
        keys: Array<Key>;
        assetAdminstrationShells?: Array<AssetAdministrationShell>;
        submodels?: Array<Submodel>;
        conceptDescriptions?: Array<ConceptDescription>;
    }) {
        super(opt);
        if (opt.assetAdminstrationShells) {
            let assetAdminstrationShells: Array<AssetAdministrationShell> = [];
            if (opt.assetAdminstrationShells.length > 0) {
                opt.assetAdminstrationShells.forEach(
                    (assetAdminstrationShell) =>
                        assetAdminstrationShells.push(assetAdminstrationShell)
                );
            }
            this.assetAdminstrationShells = assetAdminstrationShells;
        }
        if (opt.submodels) {
            let submodels: Array<Submodel> = [];
            if (opt.submodels.length > 0) {
                opt.submodels.forEach((submodel) => submodels.push(submodel));
            }
            this.submodels = submodels;
        }
        if (opt.conceptDescriptions) {
            let conceptDescriptions: Array<ConceptDescription> = [];
            if (opt.conceptDescriptions.length > 0) {
                opt.conceptDescriptions.forEach((conceptDescription) =>
                    conceptDescriptions.push(conceptDescription)
                );
            }
            this.conceptDescriptions = conceptDescriptions;
        }
    }
}

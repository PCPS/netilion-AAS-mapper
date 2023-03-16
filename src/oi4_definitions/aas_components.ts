import {
    langString,
    LangStringSet,
    ContentType,
    Identifier,
    PathType,
    QualifierType,
    ValueDataType,
    ElementCategory,
    ModelingKind,
    QualifierKind,
    DataTypeDefXsd,
    AssetKind,
    Resource,
    Key,
    KeyTypes,
    ReferenceTypes
} from './primitive_data_types';
import { Mixin } from 'ts-mixer';
import { logger } from '../services/logger';

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
    public name: string;
    public valueType?: DataTypeDefXsd;
    public value?: ValueDataType;
    public refersTo?: Referable;
    public constructor(opt: {
        semanticId?: Reference;
        supplementalSemanticIds?: Array<Reference>;
        name: string;
        valueType?: DataTypeDefXsd;
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
    public category?: ElementCategory;
    public idShort?: string;
    public displayName?: LangStringSet;
    public descriptoin?: LangStringSet;
    public checksum?: string = '';
    public constructor(opt?: {
        extensions?: Array<Extension>;
        category?: ElementCategory;
        idShort?: string;
        displayName?: LangStringSet;
        description?: LangStringSet;
        checksum?: string;
    }) {
        super(opt);
        this.category = opt?.category;
        this.idShort = opt?.idShort;
        this.displayName = opt?.displayName;
        this.descriptoin = opt?.description;
        this.checksum = opt?.checksum;
    }
}

export abstract class HasDataSpecification {
    dataSpecifications?: Array<Reference>;
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

export class AdministrativeInformation extends HasDataSpecification {
    public revision?: string;
    public version?: string;
    public constructor(opt?: {
        dataSpecifications?: Array<Reference>;
        revision?: string;
        version?: string;
    }) {
        super(opt);
        this.revision = opt?.revision;
        this.version = opt?.version;
    }
}

export abstract class Identifiable extends Referable {
    public id: string; //should be an IRI/IDRI/CustomID
    public administration?: AdministrativeInformation;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory;
        idShort?: string;
        displayName?: LangStringSet;
        description?: LangStringSet;
        checksum?: string;
        id: string;
        administration?: AdministrativeInformation;
    }) {
        super(opt);
        this.id = opt.id;
        this.administration = opt.administration;
    }
}

export abstract class HasKind {
    public kind: ModelingKind = 'Instance';
    public constructor(opt?: { kind?: ModelingKind }) {
        if (opt && opt.kind) {
            this.kind = opt.kind;
        }
    }
}

export abstract class Qualifier extends HasSemantics {
    public kind: QualifierKind = 'ConceptQualifier';
    public type: QualifierType;
    public valueType: DataTypeDefXsd;
    public value?: ValueDataType;
    public valueId?: Reference;
    public constructor(opt: {
        semanticId?: Reference;
        supplementalSemanticIds?: Array<Reference>;
        kind?: QualifierKind;
        type: QualifierType;
        valueType: DataTypeDefXsd;
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
    HasKind,
    HasSemantics,
    Qualifiable,
    HasDataSpecification
) {
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory;
        idShort?: string;
        displayName?: LangStringSet;
        description?: LangStringSet;
        checksum?: string;
        kind?: ModelingKind;
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
    public submodelElements?: Array<SubmodelElement>;
    public constructor(opt?: {
        extensions?: Array<Extension>;
        category?: ElementCategory;
        idShort?: string;
        displayName?: LangStringSet;
        description?: LangStringSet;
        checksum?: string;
        id: string;
        administration?: AdministrativeInformation;
        kind?: ModelingKind;
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
    public name: string;
    public value: string;
    public externalSubjectId: Reference;
    public constructor(opt: {
        semanticId?: Reference;
        supplementalSemanticId?: Array<Reference>;
        name: string;
        value: string;
        externalSubjectId: Reference;
    }) {
        super(opt);
        this.name = opt.name;
        this.value = opt.value;
        this.externalSubjectId = opt.externalSubjectId;
    }
}

export class AssetInformation {
    public assetKind: AssetKind;
    public globalAssetId?: Reference;
    public specificAssetIds?: Array<SpecificAssetId>;
    public defaultThumbnail?: Resource;
    public constructor(opt: {
        assetKind: AssetKind;
        globalAssetId: Reference;
        specificAssetIds?: Array<SpecificAssetId>;
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
        this.defaultThumbnail = opt.defaultThumbnail;
    }
}

export class AssetAdministrationShell extends Mixin(
    Identifiable,
    HasDataSpecification
) {
    public derivedFrom?: Reference; //To AssetAdministerationShell
    public assetInformation: AssetInformation;
    public submodels?: Array<Reference>; //To Submodel
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory;
        idShort?: string;
        displayName?: LangStringSet;
        description?: LangStringSet;
        checksum?: string;
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
    public isCaseOfs?: Array<Reference>;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory;
        idShort?: string;
        displayName?: LangStringSet;
        description?: LangStringSet;
        checksum?: string;
        id: string;
        administration?: AdministrativeInformation;
        dataSpecifications?: Array<Reference>;
        isCaseOfs?: Array<Reference>;
    }) {
        super(opt);
        if (opt.isCaseOfs) {
            let isCaseOfs: Array<Reference> = [];
            if (opt.isCaseOfs.length > 0) {
                opt.isCaseOfs.forEach((isCaseOf) => isCaseOfs.push(isCaseOf));
            }
            this.isCaseOfs = isCaseOfs;
        }
    }
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

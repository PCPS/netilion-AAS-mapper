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
import { Serialize } from './oi4_helpers';
import DST from './data_specifications';

/** AAS standard structure for References.
 * 'type: ReferenceType' defines whether this refers to a locally defined model (AAS standard element) or an external resource.
 * 'keys: Array<Key>' is an ordered list of directions where each key referes to a sub-element of the previousl key.
 * Constraint: The first key in the case of an ExternalReference must always have 'GlobalReference' as its 'Key.type'.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.10
 */
export class Reference {
    public type: ReferenceTypes;
    public referredSemanticId?: Reference;
    public keys: Array<Key>;
    public constructor(opt: {
        type: ReferenceTypes;
        referredSemanticId?: Reference;
        keys: Array<Key>;
    }) {
        this.type = opt.type;
        this.referredSemanticId = opt.referredSemanticId;
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

/** AAS standard structure for elements with semantics.
 * 'semanticId' and 'supplementalSemanticIds' refer to the primary and additional semantic descriptions of any instance of this class
 * respectively.
 * Constraint: If at least one supplemental semantic ID ('HasSemantics.supplementalSemanticIds[0]') is defined, then the primary
 * semantic ID ('HasSemantics.semanticId') must also be defined.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.6
 */
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

/** AAS standard structure for element Extensions.
 * Extesion instances are proprietary and do not support glonal interoperability.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.4
 */
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
        refersTo?: Referable;
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

/** AAS standard structure for elements with Extensions.
 * Constraint: Name of each Extension ('Extension.name') element within the list of extensions ('HasExtnesion.extentions')
 * must be unique in an instance of this class.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.4
 */
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

/** AAS standard structure for elements referable via their idShort attribute.
 * 'Referable.idShort' is not globally unique, but unique within the scope of the namespace the element.
 * Constraint: 'Referable.idShort' shall only feature letters, digits, underscore ("_"); starting mandatory with a letter,
 * i.e. [a-zA-Z][a-zA-Z0-9_]*.
 * Constraint: 'Referable.idShort' is a mandatory property of all referables except for direct childeren of SubmodelElementList elements
 * and all Identifiables.
 * Constraint: 'Referable.idShort' must be omitted for all direct children of a SubmodelElementList element.
 * Constraint: 'Referable.idShort' of Elements in the same namespace must be unique (case-sensitive).
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.10
 */
export abstract class Referable extends HasExtension {
    public category?: ValuedElementCategory | string;
    public idShort?: NameType;
    public displayName?: MultiLanguageNameType;
    public description?: MultiLanguageTextType;
    public constructor(opt?: {
        extensions?: Array<Extension>;
        category?: ValuedElementCategory | NameType; //deprecated
        idShort?: NameType;
        displayName?: MultiLanguageNameType;
        description?: MultiLanguageTextType;
    }) {
        super(opt);
        this.category = opt?.category;
        this.idShort = opt?.idShort;
        this.displayName = opt?.displayName;
        this.description = opt?.description;
    }
}

/** AAS standard structure for elements that can be extended via a data specification template which defines the names of aditional
 * optional or mandatory attributes.
 * items in 'HasDataSpecification.dataSpecifications' are strictly external references.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.3
 */
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

/**
 * 'DataSpicification.id' is a globally unique id which is referred to by 'HasDataSpicification.dataSpicification'
 * During serilization, the contents of 'DataSpecification.dataSpecificationContent' are embedded into the HasDataSpicification
 * instance by adding a list of 'EmbeddedDataSpecification' elements as a property ('HasDataSpecification.embeddedDataSpecifications')
 * to the serialized instance and removing 'HasDataSpecification.dataSpecifications' from the instance.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 6 and 7.2.5
 */
export class DataSpecification {
    public administration?: AdministrativeInformation;
    public id: Identifier;
    public dataSpecificationContent: DST.DataSpecificationContent;
    public description: LangStringSet;
    public constructor(opt: {
        administration?: AdministrativeInformation;
        id: Identifier;
        dataSpecificationContent: DST.DataSpecificationContent;
        description: MultiLanguageTextType;
    }) {
        this.administration = opt.administration;
        this.id = opt.id;
        this.dataSpecificationContent = opt.dataSpecificationContent;
        this.description = opt.description;
    }
}

/** See above. */
export class EmbeddedDataSpecification {
    dataSpecification?: Reference;
    dataSpicificationContent: DST.DataSpecificationContent;
    public constructor(opt: {
        dataSpecification?: Reference;
        dataSpicificationContent: DST.DataSpecificationContent;
    }) {
        this.dataSpecification = opt.dataSpecification;
        this.dataSpicificationContent = opt.dataSpicificationContent;
    }
}

/** AAS standard structure for elements that may contain adimistrative information (e.g. versioning information).
 * Constraint: If 'AdministrativeInformation.version' is provided, 'AdministrativeInformation.revision' is optional. Otherwise
 * it must be omitted.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.2
 */
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

/** AAS standard structure for elements that have a globally unique identifier.
 * Instances of this class shall only be referred to via their id ('Identifiable.id'). Their idShort is not unique within
 * their namespace.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.7
 */
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

/** AAS standard structure for elements which can either represent an instance or a template.
 * This is used to distinguish between submodels and submodel templates.
 * By default a Haskind element is an instance ('Haskind.kind' is 'instance')
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.5
 */
export abstract class HasKind {
    public kind: ModellingKind = 'Instance';
    public constructor(opt?: { kind?: ModellingKind }) {
        if (opt && opt.kind) {
            this.kind = opt.kind;
        }
    }
}

/** AAS standard structure for Qualifiers.
 * A type-value-pair that can make statements about the value, concept or existance of the qualifed element.
 * By default the qualifier kind (Qualifer.kind) is a concept qualifier ('Qualifier.kind' is 'ConceptQualifier')
 * valueId ('Qualifier.valueId') is recommended to be an external reference.
 * Constraint: if both value and valueId are defined, value shoud be equal to the value that valueId refers to.
 * Constraint: value should be consistent with data type given in valueType.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.9
 */
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

/** AAS standard structure for qualifiable elements.
 * Constraint: Every qualifiable can only have one qualifier with the same Qualifier/type.
 * Constraint: if an element inherits from both Qualifiable and HasKind, and one of its Qualifiers has
 * 'Qualifier.type' set to 'TemplateQualifier', then its 'HasKind.Kind' must be 'Template'.
 * Constraint: if the above condition occurs in a SubmodelElement, the Submodels that this SubmodelElement is
 * a part of must have 'Submodel.kind' set to 'Template'.
 * See document:Specification of the Asset Administration Shell part 1 v3.0 section 5.3.2.8
 */
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

/** AAS standard structure for Submodel elements.
 * It is recommended to include a semantic ID for a Submodel element ('SubmodelElement.semanticId').
 * In case of a Property SubmodelElement, if no corresponding ConceptDescription is available, then the
 * SubmodelElement may have a data specification template defined. Otherwise, there is only the property definition
 * referenced by semanticId available for the property; the attributes must be looked up online in a different way
 * and are not available offline.
 * See document:Specification of the Asset Administration Shell part 1 v3.0 section 5.3.6 and 5.3.7
 */
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
}

/** AAS standard structure for Submodel elements.
 * A submodel is used to structure the digital representation and technical functionality of an Administration Shell
 * into distinguishable parts. Each submodel refers to a well-defined domain or subject matter.
 * It is recommended to include a semantic ID for a Submodel.
 * If the value of 'Submodel.kind' is set to 'Template', all SubmodelElements within 'Submodel.submodelElements'
 * represent Submodel element templates. if 'Submodel.kind' is instance, all Submodl elements represent instances.
 * See document:Specification of the Asset Administration Shell part 1 v3.0 section 5.3.5
 */
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

/** AAS standard structure for specific asset IDs.
 * They describe a generic supplementary identifying attribute of an asset. Not necesseraliy globally unique.
 * These identifiers will be meaningful to some external subject which may be defined in
 * 'SpecificAssetId.externalSubjectId'
 * These IDs mainly serve the purpose of supporting discovery of Asset Administration Shells for an asset.
 * Constraint: 'SpecificAssetId.externalSubjectId' shall be a global reference
 * ('SpecificAssetId.externalSubjectId.type' must be 'ExternalReference').
 * See document:Specification of the Asset Administration Shell part 1 v3.0 section 5.3.4
 */
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

/** AAS standard structure for identifying meta data of an asset.
 * globalAssetId is required as soon as asset is exchanged via partners within its life cycle. It is
 * only defined as optional to cover the edge case of assets in the first phase of their life cycle when
 * this ID does not yet exist.
 * Constraint: "globalAssetId" (case-insensitive) is a reserved key. If used as value for 'SpecificAssetId.name'
 * in 'AssetInformation.specificAssetIds', 'SpecificAssetId.value' shall be identical to 'AssetInformation.globalAssetId'.
 * See document:Specification of the Asset Administration Shell part 1 v3.0 section 5.3.4
 */
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

/** AAS standard structure for Administration Shells.
 * 'AssetAdministrationShell.derivedFrom' exists to establish such a relationship between two AAS.
 * See document:Specification of the Asset Administration Shell part 1 v3.0 section 5.3.3 and 4.2
 */
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

/** AAS standard structure for elements describing semantics of a submodel or its elements.
 * 'ConceptDescription.isCaseOf' is a reference to a preferably external definition which the described concept is compatible to
 * or derived from.
 * See document:Specification of the Asset Administration Shell part 1 v3.0 section 5.3.8
 */
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
    public serialize(): Object {
        return Serialize(this, {
            modifyKeys: {
                embeddedDataSpecification: (obj: ConceptDescription) => {
                    return obj.dataSpecifications?.map((ref) => {
                        return RealizeDataSpecificationReference(ref);
                    });
                }
            },
            removeKeys: ['dataSpecifications']
        });
    }
}

/** AAS standard structure introduced solely to enable file transfer as well as serialization, and therefore not Identifiable nor referable.
 * It is a container for sets of different identifiables.
 * See document:Specification of the Asset Administration Shell part 1 v3.0 section 5.3.9
 */
export class Environment extends Reference {
    public assetAdminstrationShells?: Array<AssetAdministrationShell>;
    public submodels?: Array<Submodel>;
    public conceptDescriptions?: Array<ConceptDescription>;
    public constructor(opt: {
        type: ReferenceTypes;
        referredSemanticId?: Reference;
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
function RealizeDataSpecificationReference(ref: Reference): any {
    throw new Error('Function not implemented.');
}

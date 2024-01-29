import {
    SubmodelElement,
    Reference,
    Qualifier,
    Extension,
    SpecificAssetId
} from './aas_components';
import {
    Direction,
    ValuedElementCategory,
    LangStringSet,
    StateOfEvent,
    BlobType,
    ContentType,
    EntityType,
    PathType,
    DataTypeDefXsd,
    ValueDataType,
    AasSubmodelElements,
    Identifier,
    MessageTopicType,
    MultiLanguageTextType,
    NameType
} from './primitive_data_types';
import { xs } from './xs_data_types';

// Submodel Elements defined within the AAS standard specification.

/** Used to define a relationship between two elements being either refarable (model reference) or
 * external (external reference)
 * 'RelationshipElement.first' is the subject.
 * 'RelationshipElement.second' is the object.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.15
 */
export class RelationshipElement extends SubmodelElement {
    readonly modelType: string = 'RelationshipElement';

    public first: Reference;
    public second: Reference;
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
        first: Reference;
        second: Reference;
    }) {
        super(opt);
        this.first = opt.first;
        this.second = opt.second;
    }
}

/** Uses to define Submodel elements that aren't composed of other Submodel elements.
 * DataElement has a value. The type of this value depends on which subtype of DataElement
 * an instance belongs to.
 * Categories are deprecated.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.6
 */
export abstract class DataElement extends SubmodelElement {
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

/** Used to defined a RelationshipElement that can be furthere annotates with DataElements
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.1
 */
export class AnnotatedRelationshipElement extends RelationshipElement {
    readonly modelType: string = 'AnnotatedRelationshipElement';

    public annotations?: Array<DataElement>;
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
        first: Reference;
        second: Reference;
        annotaions?: Array<DataElement>;
    }) {
        super(opt);
        if (opt.annotaions) {
            let annotations: Array<DataElement> = [];
            opt.annotaions.forEach((annotation) => {
                annotations.push(annotation);
            });
            this.annotations = annotations;
        }
    }
}

/** Used to define events
 * Events are a very versatile mechanism of the AAS with various use cases.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 4.6, 5.3.7.8
 */
export abstract class EventElement extends SubmodelElement {
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

/** Used to define a basic EventElement.
 * 'BasicEventElement.observed' is a reference to a referable that is being observed. this can
 * be a data element or a submodel.
 * 'BasicEventElement.direction' is either 'input' or 'output'.
 * 'BasicEventElement.state' is either 'on' or 'off'
 * 'BasicEventElement.messageTopic' is used by an external infrustructure to help que the event
 * in the appropriate channel.
 * 'BasicEventElement.messageBroker' is a reference to a Submodel element container (SM, SMC, SML)
 *  which contains DataElements describing a proprietary spec for the external message broker
 * infrastructure.
 * 'BasicEventElement.minInterval' for input direction specifies the max. frequency of event
 * messages that the software entity behind the respective referable can handle, and for output
 * direction it specifies the max. frequency this message will be sent to the outer infrustructure.
 * 'BasicEventElement.maxInterval' is only applicable to output direction, and specifes the maximum
 * durtion of time before a status update for this event is sent, even if no trigger condition has
 * been met.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.3
 */
export class BasicEventElement extends EventElement {
    readonly modelType: string = 'BasicEventElement';

    public observed: Reference;
    public direction: Direction;
    public state: StateOfEvent;
    public messageTopic?: MessageTopicType;
    public messageBroker?: Reference;
    public lastUpdate?: xs.dateTime;
    public minInterval?: xs.duration;
    public maxInterval?: xs.duration;
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
        observed: Reference;
        direction: Direction;
        state: StateOfEvent;
        messageTopic?: MessageTopicType;
        messageBroker?: Reference;
        lastUpdate?: xs.dateTime;
        minInterval?: xs.duration;
        maxInterval?: xs.duration;
    }) {
        super(opt);
        this.observed = opt.observed;
        this.direction = opt.direction;
        this.state = opt.state;
        this.messageTopic = opt.messageTopic;
        this.messageBroker = opt.messageBroker;
        if (opt.lastUpdate)
            this.lastUpdate = new xs.dateTime(opt.lastUpdate?.value);
        if (opt.minInterval)
            this.minInterval = new xs.duration(opt.minInterval?.input_string);
        if (opt.maxInterval)
            this.maxInterval = new xs.duration(opt.maxInterval?.input_string);
    }
}

/** Used to specify a DataElement representing a file that is contained in the value attribute with
 * its source code. Difference between a Blob and a File is that the content of the blob is stored
 * directly inside the Blob Object, instead of a file on disk.
 * 'Blob.value' is the raw content of the blob.
 * 'Blob.contentType' is a MIME type specifying possible file extentions.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.4
 */
export class Blob extends DataElement {
    readonly modelType: string = 'Blob';

    public value?: BlobType;
    public contentType: ContentType;
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
        value?: BlobType;
        contentType: ContentType;
    }) {
        super(opt);
        this.value = opt.value;
        this.contentType = opt.contentType;
    }
}

/** Used to specify an implementation-independent description of the potential of an asset to
 * acheive a certain effect in the physical or virtual world.
 * 'Capability.sematicId' is typically an ontology, which enables reasononing on the capability.
 * To map a capability to one or more skills implementing the capability, a RelationshipElement
 * with the corresponding semantics is used. in complex cases the mapping can be a
 * SubmodelElementCollection or complete Submodel. a skill is typically a Property or Operation.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.5
 */
export class Capability extends SubmodelElement {
    readonly modelType: string = 'Capability';

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

/** Used in Submodels that define the relationship between parts of a composite asset (e.g.
 * Submodel for bill of materials). These parts are called entities. Not all entities have a global
 * asset ID.
 * 'Entity.statements' describes statements applicable to entity by a set of SubmodelElements which
 * typically have qualified values.
 * 'Entity.entityType' is either 'CoManagedEntity' or 'SelfManagedEntity'.
 * 'Entity.globalAssetId' and 'Entity.SpecificAssetId refer to the asset represented by the entity.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.7
 */
export class Entity extends SubmodelElement {
    readonly modelType: string = 'Entity';

    public statements?: Array<SubmodelElement>;
    public entityType: EntityType;
    public globalAssetId?: Identifier;
    public specificAssetIds?: Array<SpecificAssetId>;

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
        statements?: Array<SubmodelElement>;
        entityType: EntityType;
        globalAssetId?: Identifier;
        specificAssetIds?: Array<SpecificAssetId>;
    }) {
        super(opt);
        if (opt.statements) {
            let statements: Array<SubmodelElement> = [];
            opt.statements.forEach((statement) => {
                statements.push(statement);
            });
            this.statements = statements;
        }
        this.entityType = opt.entityType;
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
    }
}

/** Used to define a DataElement that represents an addres to a file (a locator). The value is a
 * URI that can represent an absolute or relative path.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.9
 * See document: Specification of the Asset Administration Shell part 5
 */
export class File extends DataElement {
    readonly modelType: string = 'File';

    public value?: PathType;
    public contentType: ContentType;
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
        value?: PathType;
        contentType: ContentType;
    }) {
        super(opt);
        this.value = opt.value;
        this.contentType = opt.contentType;
    }
}

/** used to define a property with a multi-language string as value.
 * the value can be either specified directly in the element ('MultiLanguageProperty.value'), or in case of a coded value
 * it can be referenced by the 'MultyLanguageProperty.valueId'.
 * Constraint: If both 'MultyLanguageProperty.value' and 'MultyLanguageProperty.valueId' are specified, the meaning must
 * be the same for each string in a specific language, as specified in 'MultyLanguageProperty.valueId'.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.10
 */
export class MultiLanguageProperty extends DataElement {
    readonly modelType: string = 'MultiLanguageProperty';

    public value?: LangStringSet;
    public valueId?: Reference;
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
        value?: MultiLanguageTextType;
        valueId?: Reference;
    }) {
        super(opt);
        this.value = opt.value;
        this.valueId = opt.valueId;
    }
}

/** used to define an operation variable as an attribute of an Operation. OperationVariable is introduced as separate
 * class to enable future extensions, e.g. for adding a default value or cardinality (option/mandatory).
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.11
 */
export class OperationVariable {
    readonly modelType: string = 'OperationVariable';

    public value: SubmodelElement;
    public constructor(opt: { value: SubmodelElement }) {
        this.value = opt.value;
    }
}

/** used to define an operation wiht input and output variables. operations typicall specify the behavior of a component
 * in terms of procedures. Hence, operations enable the specification of services with procedure-based interactions.
 * even if the submodel element as the value of an input and an output variable have the same idShort, this does not
 * mean that they are identical or mapped to the same variable since OperationVariables are no referables. The same
 * applies to two input variables or an input variable and an inoutputVariable and so on.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.11
 */
export class Operation extends SubmodelElement {
    readonly modelType: string = 'Operation';

    public inputVariables?: Array<OperationVariable>;
    public outputVariables?: Array<OperationVariable>;
    public inoutputVariables?: Array<OperationVariable>;
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
        inputVariables?: Array<OperationVariable>;
        outputVariables?: Array<OperationVariable>;
        inoutputVariables?: Array<OperationVariable>;
    }) {
        super(opt);
        if (opt.inputVariables) {
            let inputVariables: Array<OperationVariable> = [];
            opt.inputVariables.forEach((inputVariable) => {
                inputVariables.push(inputVariable);
            });
            this.inputVariables = inputVariables;
        }
        if (opt.outputVariables) {
            let outputVariables: Array<OperationVariable> = [];
            opt.outputVariables.forEach((outputVariable) => {
                outputVariables.push(outputVariable);
            });
            this.outputVariables = outputVariables;
        }
        if (opt.inoutputVariables) {
            let inoutputVariables: Array<OperationVariable> = [];
            opt.inoutputVariables.forEach((inoutputVariable) => {
                inoutputVariables.push(inoutputVariable);
            });
            this.inoutputVariables = inoutputVariables;
        }
    }
}

/** Used to define a DataElement with a single value.
 * Constraint: If both the 'Property.value' and 'Propert.valueId' are present, the value of the former needs to
 * be identical to the coded value resolved from the latter.
 * 'Property.value' contains the value of the property.
 * 'Property.valueType' specifies the data type of 'Property.value' or the coded value referenced by 'Property.valueId'.
 * 'Property.valueId' is a reference to a coded  value. it is recommended to use an external value for this.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.12
 */
export class Property extends DataElement {
    readonly modelType: string = 'Property';

    public valueType: DataTypeDefXsd;
    public value?: ValueDataType;
    public valueId?: Reference;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ValuedElementCategory;
        idShort?: NameType;
        displayName?: LangStringSet;
        description?: LangStringSet;
        semanticId?: Reference;
        supplementalSemanticIds?: Array<Reference>;
        qualifiers?: Array<Qualifier>;
        dataSpecifications?: Array<Reference>;
        valueType: DataTypeDefXsd;
        value?: ValueDataType;
        valueId?: Reference;
    }) {
        super(opt);
        this.valueType = opt.valueType;
        this.value = opt.value;
        this.valueId = opt.valueId;
    }
}

/** Used to define range data with a min and a max.
 * 'Range.valueType' is the data type of the 'Range.min' and 'Range.max' values.
 * 'Range.min' and 'Range.max' values define a lower and an upper band respectively for the property described by the
 * Range element.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.13
 */
export class Range extends DataElement {
    readonly modelType: string = 'Range';

    public valueType: DataTypeDefXsd;
    public min?: ValueDataType;
    public max?: ValueDataType;
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
        valueType: DataTypeDefXsd;
        min?: ValueDataType;
        max?: ValueDataType;
    }) {
        super(opt);
        this.valueType = opt.valueType;
        this.min = opt.min;
        this.max = opt.max;
    }
}

/** Used to define a logical reference to another element within the same or another AAS or a reference to an external
 * object or entity.
 * 'ReferenceElement.value' is an External reference to an external object or entity or a logical reference to another
 * element within the same or another Asset Administration Shell (i.e. a model reference to a Referable)
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.14
 */
export class ReferenceElement extends DataElement {
    readonly modelType: string = 'ReferenceElement';

    public value?: Reference;
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
        value?: Reference;
    }) {
        super(opt);
        this.value = opt.value;
    }
}

/** Used to define a logical encapsulation of named values (submodel elements).
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.16
 */
export class SubmodelElementCollection extends SubmodelElement {
    readonly modelType: string = 'SubmodelElementCollection';

    public value?: Array<SubmodelElement>;
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
        value?: Array<SubmodelElement>;
    }) {
        super(opt);
        if (opt.value) {
            let value: Array<SubmodelElement> = [];
            opt.value.forEach((item) => {
                value.push(item);
            });
            this.value = value;
        }
    }
}

/** Used to define an ordered list of submodel elements, however this ordering might be irrelevant (decided by 'SubmodelElementList.orderRelevant')
 * This element is used when there needs to be a list of semantically identical elements added to a submodel.
 * Constraint: The elements inside 'SubmodelElementList.value' shall not have 'idShort's defined.
 * Constraint: If a first level child of 'SubmodelElementList' has a 'semanticId', it shall be identicall to 'SubmodelElementList.semanticIdListElement'.
 * SubmodelElementList do not count as first level children of 'SubmodelElementList's (Specification of the Asset Administration Shell part 1 v3.0 section
 * 5.3.7.16 paragraph 2, description of multi-dimensional arrays).
 * Constraint: If two first level child elements in a SubmodelElementList have a 'semanticId', they shall be identical.
 * Constraint: If a first level child element in a 'SubmodelElementList' does not specify a 'semanticId', the value is assumed to be identical to
 * 'SubmodelElementList.semanticIdListElemen'
 * Constraint: All first level child elements in a 'SubmodelElementList' shall have the same submodel element type as specified in 'SubmodelElementList.typeValueListElement'.
 * Constraint: If SubmodelElementList/typeValueListElement is equal to Property or Range, SubmodelElementList/valueTypeListElement shall be set and all first level child
 * elements in the SubmodelElementList shall have the value type as specified in SubmodelElementList/valueTypeListElement.
 * See document: Specification of the Asset Administration Shell part 1 v3.0 section 5.3.7.16
 */
export class SubmodelElementList extends SubmodelElement {
    readonly modelType: string = 'SubmodelElementList';

    public orderRelevant?: boolean;
    public value?: Array<SubmodelElement>;
    public semanticIdListElement?: Reference;
    public typeValueListElement: AasSubmodelElements;
    public valueTypeListElement?: DataTypeDefXsd;
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
        orderRelevant?: boolean;
        value?: Array<SubmodelElement>;
        semanticIdListElement?: Reference;
        typeValueListElement: AasSubmodelElements;
        valueTypeListElement?: DataTypeDefXsd;
    }) {
        super(opt);
        this.orderRelevant = opt.orderRelevant;
        if (opt.value) {
            let value: Array<SubmodelElement> = [];
            opt.value.forEach((item) => {
                value.push(item);
            });
            this.value = value;
        }
        this.semanticIdListElement = opt.semanticIdListElement;
        this.typeValueListElement = opt.typeValueListElement;
        this.valueTypeListElement = opt.valueTypeListElement;
    }
}

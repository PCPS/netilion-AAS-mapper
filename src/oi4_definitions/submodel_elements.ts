import {
    SubmodelElement,
    Reference,
    Qualifier,
    Extension,
    SpecificAssetId
} from './aas_components';
import {
    Direction,
    ElementCategory,
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
export class RelationshipElement extends SubmodelElement {
    readonly modelType: string = 'RelationshipElement';

    public first: Reference;
    public second: Reference;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export abstract class DataElement extends SubmodelElement {
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class AnnotatedRelationshipElement extends RelationshipElement {
    readonly modelType: string = 'AnnotatedRelationshipElement';

    public annotations?: Array<DataElement>;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export abstract class EventElement extends SubmodelElement {
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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
        category?: ElementCategory | string;
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

export class Blob extends DataElement {
    readonly modelType: string = 'Blob';

    public value?: BlobType;
    public contentType: ContentType;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class Capability extends SubmodelElement {
    readonly modelType: string = 'Capability';

    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class Entity extends SubmodelElement {
    readonly modelType: string = 'Entity';

    public statements?: Array<SubmodelElement>;
    public entityType: EntityType;
    public globalAssetId?: Identifier;
    public specificAssetId?: SpecificAssetId;

    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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
        specificAssetId?: SpecificAssetId;
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
        this.specificAssetId = opt.specificAssetId;
    }
}

export class File extends DataElement {
    readonly modelType: string = 'File';

    public value?: PathType;
    public contentType: ContentType;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class MultiLanguageProperty extends DataElement {
    readonly modelType: string = 'MultiLanguageProperty';

    public value?: LangStringSet;
    public valueId?: Reference;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class OperationVariable {
    readonly modelType: string = 'OperationVariable';

    public value: SubmodelElement;
    public constructor(opt: { value: SubmodelElement }) {
        this.value = opt.value;
    }
}

export class Operation extends SubmodelElement {
    readonly modelType: string = 'Operation';

    public inputVariables?: Array<OperationVariable>;
    public outputVariables?: Array<OperationVariable>;
    public inoutputVariables?: Array<OperationVariable>;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class Property extends DataElement {
    readonly modelType: string = 'Property';

    public valueType: DataTypeDefXsd;
    public value?: ValueDataType;
    public valueId?: Reference;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class Range extends DataElement {
    readonly modelType: string = 'Range';

    public valueType: DataTypeDefXsd;
    public min?: ValueDataType;
    public max?: ValueDataType;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class ReferenceElement extends DataElement {
    readonly modelType: string = 'ReferenceElement';

    public value?: Reference;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class SubmodelElementCollection extends SubmodelElement {
    readonly modelType: string = 'SubmodelElementCollection';

    public value?: Array<SubmodelElement>;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

export class SubmodelElementList extends SubmodelElement {
    readonly modelType: string = 'SubmodelElementList';

    public orderRelevant?: boolean;
    public value?: Array<SubmodelElement>;
    public semanticIdListElement?: Reference;
    public typeValueListElement: AasSubmodelElements;
    public valueTypeListElement?: DataTypeDefXsd;
    public constructor(opt: {
        extensions?: Array<Extension>;
        category?: ElementCategory | string;
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

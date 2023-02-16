import { logger } from '../services/logger';
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
    ModelingKind,
    StateOfEvent,
    BlobType,
    ContentType,
    EntityType,
    PathType,
    DataTypeDefXsd,
    ValueDataType,
    AasSubmodelElements
} from './primitive_data_types';
import { xs } from './xs_data_types';

class RelationshipElement extends SubmodelElement {
    public first: Reference;
    public second: Reference;
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
        first: Reference;
        second: Reference;
    }) {
        super(opt);
        this.first = opt.first;
        this.second = opt.second;
    }
}

abstract class DataElement extends SubmodelElement {
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
}

class AnnotatedRelationshipElement extends RelationshipElement {
    public annotations?: Array<DataElement>;
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

abstract class EventElement extends SubmodelElement {
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
}

class BasicEventElement extends EventElement {
    public observed: Reference;
    public direction: Direction;
    public state: StateOfEvent;
    public messageTopic?: string;
    public messageBroker?: Reference;
    public lastUpdate?: xs.dateTime;
    public minInterval?: xs.dateTime; //Date object for interval value seems
    public maxInterval?: xs.dateTime; //Unnecessary and unfit. change if problems occure
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
        observed: Reference;
        direction: Direction;
        state: StateOfEvent;
        messageTopic?: string;
        messageBroker?: Reference;
        lastUpdate?: xs.dateTime;
        minInterval?: xs.dateTime;
        maxInterval?: xs.dateTime;
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
            this.minInterval = new xs.dateTime(opt.minInterval?.input_string);
        if (opt.maxInterval)
            this.maxInterval = new xs.dateTime(opt.maxInterval?.input_string);
    }
}

class Blob extends DataElement {
    public value?: BlobType;
    public contentType: ContentType;
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
        value?: BlobType;
        contentType: ContentType;
    }) {
        super(opt);
        this.value = opt.value;
        this.contentType = opt.contentType;
    }
}

class Capability extends SubmodelElement {
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
}

class Entity extends SubmodelElement {
    public statements?: Array<SubmodelElement>;
    public entityType: EntityType;
    public globalAssetId?: Reference;
    public specificAssetId?: SpecificAssetId;

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
        statements?: Array<SubmodelElement>;
        entityType: EntityType;
        globalAssetId?: Reference;
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

class File extends DataElement {
    public value?: PathType;
    public contentType: ContentType;
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
        value?: PathType;
        contentType: ContentType;
    }) {
        super(opt);
        this.value = opt.value;
        this.contentType = opt.contentType;
    }
}

class MultiLanguageProperty extends DataElement {
    public value?: LangStringSet;
    public valueId?: Reference;
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
        value?: LangStringSet;
        valueId?: Reference;
    }) {
        super(opt);
        this.value = opt.value;
        this.valueId = opt.valueId;
    }
}

class OperationVariable {
    public value: SubmodelElement;
    public constructor(opt: { value: SubmodelElement }) {
        this.value = opt.value;
    }
}

class Operation extends SubmodelElement {
    public inputVariables?: Array<OperationVariable>;
    public outputVariables?: Array<OperationVariable>;
    public inoutputVariables?: Array<OperationVariable>;
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

class Property extends DataElement {
    public valueType: DataTypeDefXsd;
    public value?: ValueDataType;
    public valueId?: Reference;
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

class Range extends DataElement {
    public valueType: DataTypeDefXsd;
    public min?: ValueDataType;
    public max?: ValueDataType;
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

class ReferenceElement extends DataElement {
    public value?: Reference;
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
        value?: Reference;
    }) {
        super(opt);
        this.value = opt.value;
    }
}

class SubmodelElementCollection extends SubmodelElement {
    public values?: Array<SubmodelElement>;
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
        values?: Array<SubmodelElement>;
    }) {
        super(opt);
        if (opt.values) {
            let values: Array<SubmodelElement> = [];
            opt.values.forEach((value) => {
                values.push(value);
            });
            this.values = values;
        }
    }
}

class SubmodelElementList extends SubmodelElement {
    public orderRelevant?: boolean;
    public values?: Array<SubmodelElement>;
    public semanticIdListElement?: Reference;
    public typeValueListElement: AasSubmodelElements;
    public valueTypeListElement?: DataTypeDefXsd;
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
        orderRelevant?: boolean;
        values?: Array<SubmodelElement>;
        semanticIdListElement?: Reference;
        typeValueListElement: AasSubmodelElements;
        valueTypeListElement?: DataTypeDefXsd;
    }) {
        super(opt);
        this.orderRelevant = opt.orderRelevant;
        if (opt.values) {
            let values: Array<SubmodelElement> = [];
            opt.values.forEach((value) => {
                values.push(value);
            });
            this.values = values;
        }
        this.semanticIdListElement = opt.semanticIdListElement;
        this.typeValueListElement = opt.typeValueListElement;
        this.valueTypeListElement = opt.valueTypeListElement;
    }
}

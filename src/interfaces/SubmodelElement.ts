export interface SubmodelElement {
    embeddedDataSpecifications: string[];
    extensions: string[];
    kind?: string;
    semanticId: SemanticId;
    value?: string | SubmodelElement[];
    valueId?: string;
    valueType?: string;
    qualifiers: string[];
    category?: string;
    description?: OI4Text[];
    displayName?: OI4Text[];
    idShort: string;
    modelType: ModelType;
}

interface OI4Text {
    language: string;
    text: string;
}

interface ModelType {
    name: string;
}

export interface SemanticId {
    keys: Key[];
}

interface Key {
    idType: string;
    type: string;
    value: string;
}

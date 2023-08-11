import { Reference, SpecificAssetId, Submodel } from '../aas_components';
import {
    ContentType,
    DataTypeDefXsd,
    LangStringSet,
    PathType,
    ValueDataType,
    EntityType,
    Identifier
} from '../primitive_data_types';
import {
    SubmodelElementCollection,
    Property,
    MultiLanguageProperty,
    ReferenceElement,
    File,
    Entity
} from '../submodel_elements';
import { xs } from '../xs_data_types';
import { SubmodelElement } from '../aas_components';
import { GetSemanticId } from '../../services/oi4_helpers';
import { number_to_padded_string } from '../../services/oi4_helpers';

function Generate_SMC_DocumentId(
    opt: {
        DocumentDomainId: string;
        ValueId: string;
        IsPrimary?: boolean;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const DocumentDomainId = new Property({
        idShort: 'DocumentDomainId',
        valueType: 'xs:string',
        value: opt.DocumentDomainId
    });
    submodelElements.push(DocumentDomainId);
    const ValueId = new Property({
        idShort: 'ValueId',
        valueType: 'xs:string',
        value: opt.ValueId
    });
    submodelElements.push(ValueId);
    if (opt.IsPrimary) {
        const IsPrimary = new Property({
            idShort: 'IsPrimary',
            valueType: 'xs:boolean',
            value: opt.IsPrimary
        });
        submodelElements.push(IsPrimary);
    }
    const result = new SubmodelElementCollection({
        idShort: 'DocumentId' + postfix,
        value: submodelElements
    });
    return result;
}
function Generate_SMC_DocumentClassification(
    opt: {
        ClassId: string;
        ClassName: LangStringSet;
        ClassificationSystem: string;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const ClassId = new Property({
        idShort: 'ClassId',
        valueType: 'xs:string',
        value: opt.ClassId
    });
    submodelElements.push(ClassId);
    const ClassName = new MultiLanguageProperty({
        idShort: 'ClassName',
        value: opt.ClassName
    });
    submodelElements.push(ClassName);
    const ClassificationSystem = new Property({
        idShort: 'ClassificationSystem',
        valueType: 'xs:string',
        value: opt.ClassificationSystem
    });
    submodelElements.push(ClassificationSystem);
    const result = new SubmodelElementCollection({
        idShort: 'DocumentClassification' + postfix,
        value: submodelElements
    });
    return result;
}
function Generate_SMC_DocumentVersion(
    opt: {
        Language: Array<string>;
        DocumentVersionId: string;
        Title: LangStringSet;
        SubTitle?: LangStringSet;
        Summary: LangStringSet;
        KeyWords: LangStringSet;
        StatusSetDate: xs.date;
        StatusValue: string;
        OrganizationName: string;
        OrganizationOfficialName: string;
        DigitalFile: Array<{ value?: PathType; contentType: ContentType }>;
        PreviewFile?: { value?: PathType; contentType: ContentType };
        ReferesTo?: Array<Reference>;
        BasedOn?: Array<Reference>;
        TranslationOf?: Array<Reference>;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    opt.Language.forEach((item, i) => {
        const Language = new Property({
            idShort: 'Language{' + number_to_padded_string(i, 3) + '}',
            valueType: 'xs:string',
            value: item
        });
        submodelElements.push(Language);
    });
    const DocumentVersionId = new Property({
        idShort: 'DocumentVersionId',
        valueType: 'xs:string',
        value: opt.DocumentVersionId
    });
    submodelElements.push(DocumentVersionId);
    const Title = new MultiLanguageProperty({
        idShort: 'Title',
        value: opt.Title
    });
    submodelElements.push(Title);
    if (opt.SubTitle) {
        const SubTitle = new MultiLanguageProperty({
            idShort: 'SubTitle',
            value: opt.SubTitle
        });
        submodelElements.push(SubTitle);
    }
    const Summary = new MultiLanguageProperty({
        idShort: 'Summary',
        value: opt.Summary
    });
    submodelElements.push(Summary);
    const KeyWords = new MultiLanguageProperty({
        idShort: 'KeyWords',
        value: opt.KeyWords
    });
    submodelElements.push(KeyWords);
    const StatusSetDate = new Property({
        idShort: 'StatusSetDate',
        valueType: 'xs:date',
        value: opt.StatusSetDate
    });
    submodelElements.push(StatusSetDate);
    const StatusValue = new Property({
        idShort: 'StatusValue',
        valueType: 'xs:string',
        value: opt.StatusValue
    });
    submodelElements.push(StatusValue);
    const OrganizationName = new Property({
        idShort: 'OrganizationName',
        valueType: 'xs:string',
        value: opt.OrganizationName
    });
    submodelElements.push(OrganizationName);
    const OrganizationOfficialName = new Property({
        idShort: 'OrganizationOfficialName',
        valueType: 'xs:string',
        value: opt.OrganizationOfficialName
    });
    submodelElements.push(OrganizationOfficialName);
    opt.DigitalFile.forEach((item, i) => {
        const DigitalFile = new File({
            idShort: 'DigitalFile{' + number_to_padded_string(i, 3) + '}',
            value: item.value,
            contentType: item.contentType
        });
        submodelElements.push(DigitalFile);
    });
    if (opt.PreviewFile) {
        const PreviewFile = new File({
            idShort: 'PreviewFile',
            value: opt.PreviewFile.value,
            contentType: opt.PreviewFile.contentType
        });
        submodelElements.push(PreviewFile);
    }
    if (opt.ReferesTo) {
        opt.ReferesTo.forEach((item, i) => {
            const ReferesTo = new ReferenceElement({
                idShort: 'ReferesTo{' + number_to_padded_string(i, 3) + '}',
                value: item
            });
            submodelElements.push(ReferesTo);
        });
    }
    if (opt.BasedOn) {
        opt.BasedOn.forEach((item, i) => {
            const BasedOn = new ReferenceElement({
                idShort: 'BasedOn{' + number_to_padded_string(i, 3) + '}',
                value: item
            });
            submodelElements.push(BasedOn);
        });
    }
    if (opt.TranslationOf) {
        opt.TranslationOf.forEach((item, i) => {
            const TranslationOf = new ReferenceElement({
                idShort: 'TranslationOf{' + number_to_padded_string(i, 3) + '}',
                value: item
            });
            submodelElements.push(TranslationOf);
        });
    }
    const result = new SubmodelElementCollection({
        idShort: 'DocumentVersion' + postfix,
        value: submodelElements
    });
    return result;
}
function Generate_SMC_Document(
    opt: {
        DocumentId: Array<{
            DocumentDomainId: string;
            ValueId: string;
            IsPrimary?: boolean;
        }>;
        DocumentClassification: Array<{
            ClassId: string;
            ClassName: LangStringSet;
            ClassificationSystem: string;
        }>;
        DocumentVersion?: Array<{
            Language: Array<string>;
            DocumentVersionId: string;
            Title: LangStringSet;
            SubTitle?: LangStringSet;
            Summary: LangStringSet;
            KeyWords: LangStringSet;
            StatusSetDate: xs.date;
            StatusValue: string;
            OrganizationName: string;
            OrganizationOfficialName: string;
            DigitalFile: Array<{ value?: PathType; contentType: ContentType }>;
            PreviewFile?: { value?: PathType; contentType: ContentType };
            ReferesTo?: Array<Reference>;
            BasedOn?: Array<Reference>;
            TranslationOf?: Array<Reference>;
        }>;
        DocumentedEntity?: Array<Reference>;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    opt.DocumentId.forEach((item, i) => {
        const DocumentId = Generate_SMC_DocumentId(item);
        submodelElements.push(DocumentId);
    });
    opt.DocumentClassification.forEach((item, i) => {
        const DocumentClassification =
            Generate_SMC_DocumentClassification(item);
        submodelElements.push(DocumentClassification);
    });
    if (opt.DocumentVersion) {
        opt.DocumentVersion.forEach((item, i) => {
            const DocumentVersion = Generate_SMC_DocumentVersion(item);
            submodelElements.push(DocumentVersion);
        });
    }
    if (opt.DocumentedEntity) {
        opt.DocumentedEntity.forEach((item, i) => {
            const DocumentedEntity = new ReferenceElement({
                idShort:
                    'DocumentedEntity{' + number_to_padded_string(i, 3) + '}',
                value: item
            });
            submodelElements.push(DocumentedEntity);
        });
    }
    const result = new SubmodelElementCollection({
        idShort: 'Document' + postfix,
        value: submodelElements
    });
    return result;
}
export function Generate_SM_HandoverDocumentation(
    opt: {
        Document?: Array<{
            DocumentId: Array<{
                DocumentDomainId: string;
                ValueId: string;
                IsPrimary?: boolean;
            }>;
            DocumentClassification: Array<{
                ClassId: string;
                ClassName: LangStringSet;
                ClassificationSystem: string;
            }>;
            DocumentVersion?: Array<{
                Language: Array<string>;
                DocumentVersionId: string;
                Title: LangStringSet;
                SubTitle?: LangStringSet;
                Summary: LangStringSet;
                KeyWords: LangStringSet;
                StatusSetDate: xs.date;
                StatusValue: string;
                OrganizationName: string;
                OrganizationOfficialName: string;
                DigitalFile: Array<{
                    value?: PathType;
                    contentType: ContentType;
                }>;
                PreviewFile?: { value?: PathType; contentType: ContentType };
                ReferesTo?: Array<Reference>;
                BasedOn?: Array<Reference>;
                TranslationOf?: Array<Reference>;
            }>;
            DocumentedEntity?: Array<Reference>;
        }>;
        entity?: Array<{
            statements?: Array<SubmodelElement>;
            entityType: EntityType;
            globalAssetId?: Identifier;
            specificAssetId?: SpecificAssetId;
        }>;
    },
    id: string,
    idShort_postfix?: string
): Submodel {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.Document) {
        opt.Document.forEach((item, i) => {
            const Document = Generate_SMC_Document(item);
            submodelElements.push(Document);
        });
    }
    if (opt.entity) {
        opt.entity.forEach((item, i) => {
            const entity = new Entity({
                idShort: 'Entity{' + number_to_padded_string(i, 3) + '}',
                statements: item.statements,
                entityType: item.entityType,
                globalAssetId: item.globalAssetId,
                specificAssetId: item.specificAssetId
            });
            submodelElements.push(entity);
        });
    }
    const result = new Submodel({
        id: id,
        idShort: 'HandoverDocumentation' + postfix,
        submodelElements: submodelElements
    });
    return result;
}

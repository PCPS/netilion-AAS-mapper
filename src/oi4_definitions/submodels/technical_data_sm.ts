import { Reference, SpecificAssetId, Submodel } from '../aas_components';
import {
    ContentType,
    DataTypeDefXsd,
    LangStringSet,
    PathType,
    ValueDataType,
    EntityType,
    Identifier,
    AasSubmodelElements
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
import { GetSemanticId } from '../oi4_helpers';
import { number_to_padded_string } from '../oi4_helpers';

function Generate_SMC_ProductClassificationItem(
    opt: {
        ProductClassificationSystem: string;
        ClassificationSystemVersion?: string;
        ProductClassId: string;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const ProductClassificationSystem = new Property({
        idShort: 'ProductClassificationSystem',
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'https://admin-shell.io/ZVEI/TechnicalData/ProductClassificationSystem/1/1'
                }
            ]
        },
        valueType: 'xs:string',
        value: opt.ProductClassificationSystem.toString()
    });
    submodelElements.push(ProductClassificationSystem);
    if (opt.ClassificationSystemVersion) {
        const ClassificationSystemVersion = new Property({
            idShort: 'ClassificationSystemVersion',
            semanticId: {
                type: 'ModelReference',
                keys: [
                    {
                        type: 'ConceptDescription',
                        value: 'https://admin-shell.io/ZVEI/TechnicalData/ClassificationSystemVersion/1/1'
                    }
                ]
            },
            valueType: 'xs:string',
            value: opt.ClassificationSystemVersion.toString()
        });
        submodelElements.push(ClassificationSystemVersion);
    }
    const ProductClassId = new Property({
        idShort: 'ProductClassId',
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'http://admin-shell.io/ZVEI/TechnicalData/ProductClassId/1/1'
                }
            ]
        },
        valueType: 'xs:string',
        value: opt.ProductClassId.toString()
    });
    submodelElements.push(ProductClassId);
    const result = new SubmodelElementCollection({
        idShort: 'ProductClassificationItem' + postfix,
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'https://admin-shell.io/ZVEI/TechnicalData/ProductClassificationItem/1/1'
                }
            ]
        },
        value: submodelElements
    });
    return result;
}
function Generate_SMC_SubSection(
    opt: {
        arbitrary_elements?: Array<{
            idShort: string;
            semanticId?: Reference;
            modelType: AasSubmodelElements;
            value: Record<string, any>;
        }>;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.arbitrary_elements) {
        opt.arbitrary_elements.forEach((item) => {
            switch (item.modelType) {
                case 'Property':
                    {
                        const element = new Property({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            valueType: item.value.valueType,
                            value: item.value.value
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'MultiLanguageProperty':
                    {
                        const element = new MultiLanguageProperty({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            value: item.value.value
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'ReferenceElement':
                    {
                        const element = new ReferenceElement({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            value: item.value.value
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'File':
                    {
                        const element = new File({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            value: item.value.value,
                            contentType: item.value.contentType
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'Entity':
                    {
                        const element = new Entity({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            statements: item.value.statements,
                            entityType: item.value.entityType,
                            globalAssetId: item.value.globalAssetId,
                            specificAssetIds: item.value.spicificAssetIds
                        });
                        submodelElements.push(element);
                    }
                    break;
            }
        });
    }
    const result = new SubmodelElementCollection({
        idShort: 'SubSection' + postfix,
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'http://admin-shell.io/ZVEI/TechnicalData/SubSection/1/1'
                }
            ]
        },
        value: submodelElements
    });
    return result;
}
function Generate_SMC_MainSection(
    opt: {
        arbitrary_elements?: Array<{
            idShort: string;
            semanticId?: Reference;
            modelType: AasSubmodelElements;
            value: Record<string, any>;
        }>;
        SubSection?: Array<{
            arbitrary_elements?: Array<{
                idShort: string;
                semanticId?: Reference;
                modelType: AasSubmodelElements;
                value: Record<string, any>;
            }>;
        }>;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.arbitrary_elements) {
        opt.arbitrary_elements.forEach((item) => {
            switch (item.modelType) {
                case 'Property':
                    {
                        const element = new Property({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            valueType: item.value.valueType,
                            value: item.value.value
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'MultiLanguageProperty':
                    {
                        const element = new MultiLanguageProperty({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            value: item.value.value
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'ReferenceElement':
                    {
                        const element = new ReferenceElement({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            value: item.value.value
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'File':
                    {
                        const element = new File({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            value: item.value.value,
                            contentType: item.value.contentType
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'Entity':
                    {
                        const element = new Entity({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            statements: item.value.statements,
                            entityType: item.value.entityType,
                            globalAssetId: item.value.globalAssetId,
                            specificAssetIds: item.value.spicificAssetIds
                        });
                        submodelElements.push(element);
                    }
                    break;
            }
        });
    }
    if (opt.SubSection) {
        opt.SubSection.forEach((item, i) => {
            const SubSection = Generate_SMC_SubSection(item);
            submodelElements.push(SubSection);
        });
    }
    const result = new SubmodelElementCollection({
        idShort: 'MainSection' + postfix,
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'http://admin-shell.io/ZVEI/TechnicalData/MainSection/1/1'
                }
            ]
        },
        value: submodelElements
    });
    return result;
}

function Generate_SMC_GeneralInformation(
    opt: {
        ManufacturerName: string;
        ManufacturerLogo?: { value?: PathType; contentType: ContentType };
        ManufacturerProductDesignation: string;
        ManufacturerArticleNumber: string;
        ManufacturerOrderCode: string;
        ProdutImage?: Array<{ value?: PathType; contentType: ContentType }>;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const ManufacturerName = new Property({
        idShort: 'ManufacturerName',
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: '0173-1#02-AAO677#002'
                }
            ]
        },
        valueType: 'xs:string',
        value: opt.ManufacturerName.toString()
    });
    submodelElements.push(ManufacturerName);
    if (opt.ManufacturerLogo) {
        const ManufacturerLogo = new File({
            idShort: 'ManufacturerLogo',
            semanticId: {
                type: 'ModelReference',
                keys: [
                    {
                        type: 'ConceptDescription',
                        value: 'https://admin-shell.io/ZVEI/TechnicalData/ManufacturerLogo/1/1'
                    }
                ]
            },
            value: opt.ManufacturerLogo.value,
            contentType: opt.ManufacturerLogo.contentType
        });
        submodelElements.push(ManufacturerLogo);
    }
    const ManufacturerProductDesignation = new Property({
        idShort: 'ManufacturerProductDesignation',
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: '0173-1#02-AAW338#001'
                }
            ]
        },
        valueType: 'xs:string',
        value: opt.ManufacturerProductDesignation.toString()
    });
    submodelElements.push(ManufacturerProductDesignation);
    const ManufacturerArticleNumber = new Property({
        idShort: 'ManufacturerArticleNumber',
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: '0173-1#02-AAO676#003'
                }
            ]
        },
        valueType: 'xs:string',
        value: opt.ManufacturerArticleNumber.toString()
    });
    submodelElements.push(ManufacturerArticleNumber);
    const ManufacturerOrderCode = new Property({
        idShort: 'ManufacturerOrderCode',
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: '0173-1#02-AAO227#002'
                }
            ]
        },
        valueType: 'xs:string',
        value: opt.ManufacturerOrderCode.toString()
    });
    submodelElements.push(ManufacturerOrderCode);
    if (opt.ProdutImage) {
        opt.ProdutImage.forEach((item, i) => {
            const ProdutImage = new File({
                idShort: 'ProdutImage{' + number_to_padded_string(i, 3) + '}',
                semanticId: {
                    type: 'ModelReference',
                    keys: [
                        {
                            type: 'ConceptDescription',
                            value: 'https://admin-shell.io/ZVEI/TechnicalData/ProductImage/1/1'
                        }
                    ]
                },
                value: item.value,
                contentType: item.contentType
            });
            submodelElements.push(ProdutImage);
        });
    }
    const result = new SubmodelElementCollection({
        idShort: 'GeneralInformation' + postfix,
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'https://admin-shell.io/ZVEI/TechnicalData/GeneralInformation/1/1'
                }
            ]
        },
        value: submodelElements
    });
    return result;
}
function Generate_SMC_ProductClassifications(
    opt: {
        ProductClassificationItem?: Array<{
            ProductClassificationSystem: string;
            ClassificationSystemVersion?: string;
            ProductClassId: string;
        }>;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.ProductClassificationItem) {
        opt.ProductClassificationItem.forEach((item, i) => {
            const ProductClassificationItem =
                Generate_SMC_ProductClassificationItem(item);
            submodelElements.push(ProductClassificationItem);
        });
    }
    const result = new SubmodelElementCollection({
        idShort: 'ProductClassifications' + postfix,
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'https://admin-shell.io/ZVEI/TechnicalData/ProductClassifications/1/1'
                }
            ]
        },
        value: submodelElements
    });
    return result;
}
function Generate_SMC_TechnicalProperties(
    opt: {
        arbitrary_elements?: Array<{
            idShort: string;
            semanticId?: Reference;
            modelType: AasSubmodelElements;
            value: Record<string, any>;
        }>;
        MainSection?: Array<{
            arbitrary_elements?: Array<{
                idShort: string;
                semanticId?: Reference;
                modelType: AasSubmodelElements;
                value: Record<string, any>;
            }>;
            SubSection?: Array<{
                arbitrary_elements?: Array<{
                    idShort: string;
                    semanticId?: Reference;
                    modelType: AasSubmodelElements;
                    value: Record<string, any>;
                }>;
            }>;
        }>;
        SubSection?: Array<{
            arbitrary_elements?: Array<{
                idShort: string;
                semanticId?: Reference;
                modelType: AasSubmodelElements;
                value: Record<string, any>;
            }>;
        }>;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.arbitrary_elements) {
        opt.arbitrary_elements.forEach((item) => {
            switch (item.modelType) {
                case 'Property':
                    {
                        const element = new Property({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            valueType: item.value.valueType,
                            value: item.value.value
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'MultiLanguageProperty':
                    {
                        const element = new MultiLanguageProperty({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            value: item.value.value
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'ReferenceElement':
                    {
                        const element = new ReferenceElement({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            value: item.value.value
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'File':
                    {
                        const element = new File({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            value: item.value.value,
                            contentType: item.value.contentType
                        });
                        submodelElements.push(element);
                    }
                    break;

                case 'Entity':
                    {
                        const element = new Entity({
                            idShort: item.idShort,
                            semanticId: item.semanticId,
                            statements: item.value.statements,
                            entityType: item.value.entityType,
                            globalAssetId: item.value.globalAssetId,
                            specificAssetIds: item.value.spicificAssetIds
                        });
                        submodelElements.push(element);
                    }
                    break;
            }
        });
    }
    if (opt.MainSection) {
        opt.MainSection.forEach((item, i) => {
            const MainSection = Generate_SMC_MainSection(item);
            submodelElements.push(MainSection);
        });
    }
    if (opt.SubSection) {
        opt.SubSection.forEach((item, i) => {
            const SubSection = Generate_SMC_SubSection(item);
            submodelElements.push(SubSection);
        });
    }
    const result = new SubmodelElementCollection({
        idShort: 'TechnicalProperties' + postfix,
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'https://admin-shell.io/ZVEI/TechnicalData/TechnicalProperties/1/1'
                }
            ]
        },
        value: submodelElements
    });
    return result;
}
function Generate_SMC_FurtherInformation(
    opt: {
        TextStatement?: Array<LangStringSet>;
        ValidDate: xs.date;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.TextStatement) {
        opt.TextStatement.forEach((item, i) => {
            const TextStatement = new MultiLanguageProperty({
                idShort: 'TextStatement{' + number_to_padded_string(i, 3) + '}',
                semanticId: {
                    type: 'ModelReference',
                    keys: [
                        {
                            type: 'ConceptDescription',
                            value: 'http://admin-shell.io/ZVEI/TechnicalData/TextStatement/1/1'
                        }
                    ]
                },
                value: item
            });
            submodelElements.push(TextStatement);
        });
    }
    const ValidDate = new Property({
        idShort: 'ValidDate',
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'http://admin-shell.io/ZVEI/TechnicalData/ValidDate/1/1'
                }
            ]
        },
        valueType: 'xs:date',
        value: opt.ValidDate.toString()
    });
    submodelElements.push(ValidDate);
    const result = new SubmodelElementCollection({
        idShort: 'FurtherInformation' + postfix,
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'https://admin-shell.io/ZVEI/TechnicalData/FurtherInformation/1/1'
                }
            ]
        },
        value: submodelElements
    });
    return result;
}
export function Generate_SM_TechnicalData(
    opt: {
        GeneralInformation: {
            ManufacturerName: string;
            ManufacturerLogo?: { value?: PathType; contentType: ContentType };
            ManufacturerProductDesignation: string;
            ManufacturerArticleNumber: string;
            ManufacturerOrderCode: string;
            ProdutImage?: Array<{ value?: PathType; contentType: ContentType }>;
        };
        ProductClassifications?: {
            ProductClassificationItem?: Array<{
                ProductClassificationSystem: string;
                ClassificationSystemVersion?: string;
                ProductClassId: string;
            }>;
        };
        TechnicalProperties: {
            arbitrary_elements?: Array<{
                idShort: string;
                semanticId?: Reference;
                modelType: AasSubmodelElements;
                value: Record<string, any>;
            }>;
            MainSection?: Array<{
                arbitrary_elements?: Array<{
                    idShort: string;
                    semanticId?: Reference;
                    modelType: AasSubmodelElements;
                    value: Record<string, any>;
                }>;
                SubSection?: Array<{
                    arbitrary_elements?: Array<{
                        idShort: string;
                        semanticId?: Reference;
                        modelType: AasSubmodelElements;
                        value: Record<string, any>;
                    }>;
                }>;
            }>;
            SubSection?: Array<{
                arbitrary_elements?: Array<{
                    idShort: string;
                    semanticId?: Reference;
                    modelType: AasSubmodelElements;
                    value: Record<string, any>;
                }>;
            }>;
        };
        FurtherInformation?: {
            TextStatement?: Array<LangStringSet>;
            ValidDate: xs.date;
        };
    },
    id: string,
    idShort_postfix?: string
): Submodel {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const GeneralInformation = Generate_SMC_GeneralInformation(
        opt.GeneralInformation
    );
    submodelElements.push(GeneralInformation);
    if (opt.ProductClassifications) {
        const ProductClassifications = Generate_SMC_ProductClassifications(
            opt.ProductClassifications
        );
        submodelElements.push(ProductClassifications);
    }
    const TechnicalProperties = Generate_SMC_TechnicalProperties(
        opt.TechnicalProperties
    );
    submodelElements.push(TechnicalProperties);
    if (opt.FurtherInformation) {
        const FurtherInformation = Generate_SMC_FurtherInformation(
            opt.FurtherInformation
        );
        submodelElements.push(FurtherInformation);
    }
    const result = new Submodel({
        id: id,
        idShort: 'TechnicalData' + postfix,
        semanticId: {
            type: 'ModelReference',
            keys: [
                {
                    type: 'ConceptDescription',
                    value: 'https://admin-shell.io/ZVEI/TechnicalData/Submodel/1/2'
                }
            ]
        },
        submodelElements: submodelElements
    });
    return result;
}

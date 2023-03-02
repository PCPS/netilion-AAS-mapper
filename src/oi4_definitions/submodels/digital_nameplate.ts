import { Submodel } from '../aas_components';
import { ContentType, LangStringSet } from '../primitive_data_types';
import { submodel_elements as SME } from '../submodel_elements';
import { xs } from '../xs_data_types';
import { contactInformationToSMC } from './contact_information';
import { SubmodelElement } from '../aas_components';

export function GenerateNameplate(product: {
    id: string;
    uri: string;
    name: LangStringSet;
    shortDesignation: LangStringSet;
    contactInformation: {
        roleOfContactPerson?: string;
        nationalCode: LangStringSet;
        language?: Array<string>;
        timeZone?: string;
        cityTown: LangStringSet;
        company?: LangStringSet;
        department?: LangStringSet;
        phone?: {
            telephoneNumber: LangStringSet;
            typeOfTelephone?: string;
            availableTime?: LangStringSet;
        };
        fax?: {
            faxNumber: LangStringSet;
            typeOfFaxNumber?: string;
        };
        email?: {
            emailAddress: string;
            publicKey?: LangStringSet;
            typeOfEmailAdress?: string;
            typeOfPublicKey?: LangStringSet;
        };
        ipCommunication?: Array<{
            additionalLinkAddress: string;
            typeOfCommunication?: string;
            availableTime?: LangStringSet;
        }>;
        street: LangStringSet;
        zipcode: LangStringSet;
        poBox?: LangStringSet;
        poBoxZipcode?: LangStringSet;
        stateCounty?: LangStringSet;
        nameOfContact?: LangStringSet;
        firstname?: LangStringSet;
        middleNames?: LangStringSet;
        title?: LangStringSet;
        academicTitle?: LangStringSet;
        furtherContactDetails?: LangStringSet;
        addressOfAdditionalLink?: string;
    };
    root?: LangStringSet;
    family?: LangStringSet;
    type?: LangStringSet;
    orderCode?: LangStringSet;
    articleNumber?: LangStringSet;
    serialNumber?: string;
    constructionYear: string;
    manufacturingDate?: xs.date;
    hardwareVersion?: LangStringSet;
    firmwareVersion?: LangStringSet;
    softwareVersion?: LangStringSet;
    countryOfOrigin?: string;
    companyLogo?: { url: string; mediaType: string };
    markings?: SME.SubmodelElementCollection;
    assetSpecificProperties?: SME.SubmodelElementCollection;
}): Submodel {
    let nameplateElements: Array<SubmodelElement> = [];

    const URIOFTheProduct = new SME.Property({
        idShort: 'URIOfTheProduct',
        semanticId: {
            type: 'GlobalReference',
            keys: [
                {
                    type: 'Property',
                    value: '[IRDI] 0173-1#02-AAY811#001'
                }
            ]
        },
        description: [
            {
                language: 'en',
                text: 'unique global identification of the product usingan\
 universal resource identifier (URI)'
            }
        ],
        valueType: 'xs:string',
        value: product.uri
    });
    nameplateElements.push(URIOFTheProduct);

    const ManufacturerName = new SME.MultiLanguageProperty({
        idShort: 'ManufacturerName',
        semanticId: {
            type: 'GlobalReference',
            keys: [
                {
                    type: 'MultiLanguageProperty',
                    value: '[IRDI] 0173-1#02-AAO677#002'
                }
            ]
        },
        description: [
            {
                language: 'en',
                text: 'legally valid designation of the natural or judicial\
 person which is directly responsible for the design, production, packaging and\
 labeling of a product in respect to its being brought into circulation'
            }
        ],
        value: product.name
    });
    nameplateElements.push(ManufacturerName);

    const ManufacturerProductDesignation = new SME.MultiLanguageProperty({
        idShort: 'ManufacturerProductDesignation',
        semanticId: {
            type: 'GlobalReference',
            keys: [
                {
                    type: 'MultiLanguageProperty',
                    value: '[IRDI] 0173-1#02-AAW338#001'
                }
            ]
        },
        description: [
            {
                language: 'en',
                text: 'Short description of the product (short text)'
            }
        ],
        value: product.shortDesignation
    });
    nameplateElements.push(ManufacturerProductDesignation);

    const ContactInformation: SME.SubmodelElementCollection =
        contactInformationToSMC(product.contactInformation);
    nameplateElements.push(ContactInformation);

    if (product.root) {
        const ManufacturerProductRoot = new SME.MultiLanguageProperty({
            idShort: 'ManufacturerProductRoot',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAU732#001'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'Top level of a 3 level manufacturer specific product hierarchy'
                }
            ],
            value: product.root
        });
        nameplateElements.push(ManufacturerProductRoot);
    }

    if (product.family) {
        const ManufacturerProductFamily = new SME.MultiLanguageProperty({
            idShort: 'ManufacturerProductFamily',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAU731#001'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: '2nd level of a 3 level manufacturer specific product hierarchy'
                }
            ],
            value: product.family
        });
        nameplateElements.push(ManufacturerProductFamily);
    }

    if (product.type) {
        const ManufacturerProductType = new SME.MultiLanguageProperty({
            idShort: 'ManufacturerProductType',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO057#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'Characteristic to differentiate between different\
 products of a product family or special variants'
                }
            ],
            value: product.type
        });
        nameplateElements.push(ManufacturerProductType);
    }

    if (product.orderCode) {
        const OrderCodeOfManufacturer = new SME.MultiLanguageProperty({
            idShort: 'OrderCodeOfManufacturer',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO227#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'By manufactures issued unique combination of numbers\
 and letters used to identify the device for ordering'
                }
            ],
            value: product.orderCode
        });
        nameplateElements.push(OrderCodeOfManufacturer);
    }

    if (product.articleNumber) {
        const ProductArticleNumberOfManufacturer =
            new SME.MultiLanguageProperty({
                idShort: 'ProductArticleNumberOfManufacturer',
                semanticId: {
                    type: 'GlobalReference',
                    keys: [
                        {
                            type: 'MultiLanguageProperty',
                            value: '[IRDI] 0173-1#02-AAO676#003'
                        }
                    ]
                },
                description: [
                    {
                        language: 'en',
                        text: 'unique product identifier of the manufacturer'
                    }
                ],
                value: product.articleNumber
            });
        nameplateElements.push(ProductArticleNumberOfManufacturer);
    }

    if (product.serialNumber) {
        const SerialNumber = new SME.Property({
            idShort: 'SerialNumber',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAM556#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'unique combination of numbers and letters used to\
 identify the device once it has been manufactured'
                }
            ],
            valueType: 'xs:string',
            value: product.serialNumber
        });
        nameplateElements.push(SerialNumber);
    }

    const YearOfConstruction = new SME.Property({
        idShort: 'YearOfConstruction',
        semanticId: {
            type: 'GlobalReference',
            keys: [
                {
                    type: 'MultiLanguageProperty',
                    value: '[IRDI] 0173-1#02-AAP906#001'
                }
            ]
        },
        description: [
            {
                language: 'en',
                text: 'Year as completion date of object'
            }
        ],
        valueType: 'xs:string',
        value: product.constructionYear
    });
    nameplateElements.push(YearOfConstruction);

    if (product.manufacturingDate) {
        const DateOfManufacture = new SME.Property({
            idShort: 'DateOfManufacture',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAR972#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'Date from which the production and / or development\
 process is completed or from which a service is provided completely'
                }
            ],
            valueType: 'xs:date',
            value: product.manufacturingDate
        });
        nameplateElements.push(DateOfManufacture);
    }

    if (product.hardwareVersion) {
        const HardwareVersion = new SME.MultiLanguageProperty({
            idShort: 'HardwareVersion',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAN270#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'Version of the hardware supplied with the device'
                }
            ],
            value: product.hardwareVersion
        });
        nameplateElements.push(HardwareVersion);
    }

    if (product.firmwareVersion) {
        const FirmwareVersion = new SME.MultiLanguageProperty({
            idShort: 'FirmwareVersion',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAM985#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'Version of the firmware supplied with the device'
                }
            ],
            value: product.firmwareVersion
        });
        nameplateElements.push(FirmwareVersion);
    }

    if (product.softwareVersion) {
        const SoftwareVersion = new SME.MultiLanguageProperty({
            idShort: 'SoftwareVersion',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAM737#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'Version of the software used with the device'
                }
            ],
            value: product.softwareVersion
        });
        nameplateElements.push(SoftwareVersion);
    }

    if (product.countryOfOrigin) {
        const CountryOfOrigin = new SME.Property({
            idShort: 'CountryOfOrigin',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO259#004'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'Country where the product was manufactured'
                }
            ],
            valueType: 'xs:string',
            value: product.countryOfOrigin
        });
        nameplateElements.push(CountryOfOrigin);
    }

    if (product.companyLogo) {
        const contentType: ContentType = {
            mediaType: product.companyLogo.mediaType.split('/')[0],
            subType: product.companyLogo.mediaType.split('/')[1]
        };
        const CompanyLogo = new SME.File({
            idShort: 'CompanyLogo',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'File',
                        value: '[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/CompanyLogo'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'A graphic mark used to represent a company, an organisation or a product'
                }
            ],
            value: product.companyLogo.url,
            contentType: contentType
        });
        nameplateElements.push(CompanyLogo);
    }

    if (product.markings) {
        const Markings: SME.SubmodelElementCollection = product.markings;
        nameplateElements.push(Markings);
    }

    if (product.assetSpecificProperties) {
        const AssetSpecificProperties: SME.SubmodelElementCollection =
            product.assetSpecificProperties;
        nameplateElements.push(AssetSpecificProperties);
    }

    const nameplate = new Submodel({
        id: product.id,
        idShort: 'Nameplate',
        semanticId: {
            type: 'GlobalReference',
            keys: [
                {
                    type: 'Submodel',
                    value: '[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate'
                }
            ]
        },
        submodelElements: nameplateElements
    });
    return nameplate;
}

import { LangStringSet } from '../primitive_data_types';
import { submodel_elements as SME } from '../submodel_elements';
import { Reference, SubmodelElement } from '../aas_components';
import { GenerateChildSemanticId } from '../../services/oi4_helpers';

//actuall submodel implementation missing

function pad(i: number) {
    const zeros = '00';
    const conc = zeros + i;
    return conc.slice(conc.length - zeros.length);
}

export function contactInformationToSMC(opt: {
    contactInfo: {
        //incomplete. Support only added for necessary values for Nameplate
        roleOfContactPerson?: string;
        nationalCode?: LangStringSet;
        language?: Array<string>;
        timeZone?: string;
        cityTown?: LangStringSet;
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
        street?: LangStringSet;
        zipcode?: LangStringSet;
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
    parentSemanticId?: Reference;
    idShortExtention?: string;
}): SME.SubmodelElementCollection {
    let smcvals: Array<SubmodelElement> = [];
    let smcSemanticId = GenerateChildSemanticId({
        parent: opt.parentSemanticId,
        keys: [
            {
                type: 'SubmodelElementCollection',
                value: '[IRI] https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation'
            }
        ]
    });
    if (opt.contactInfo.street) {
        const Street = new SME.MultiLanguageProperty({
            idShort: 'Street',
            semanticId: GenerateChildSemanticId({
                parent: smcSemanticId,
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO128#002'
                    }
                ]
            }),
            description: [
                {
                    language: 'en',
                    text: 'street name and house number'
                }
            ],
            value: opt.contactInfo.street
        });
        smcvals.push(Street);
    }

    if (opt.contactInfo.zipcode) {
        const Zipocode = new SME.MultiLanguageProperty({
            idShort: 'Zipcode',
            semanticId: GenerateChildSemanticId({
                parent: smcSemanticId,
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO129#002'
                    }
                ]
            }),
            description: [
                {
                    language: 'en',
                    text: 'ZIP code of address'
                }
            ],
            value: opt.contactInfo.zipcode
        });
        smcvals.push(Zipocode);
    }

    if (opt.contactInfo.cityTown) {
        const CityTown = new SME.MultiLanguageProperty({
            idShort: 'CityTown',
            semanticId: GenerateChildSemanticId({
                parent: smcSemanticId,
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO132#002'
                    }
                ]
            }),
            description: [
                {
                    language: 'en',
                    text: 'town or city'
                }
            ],
            value: opt.contactInfo.cityTown
        });
        smcvals.push(CityTown);
    }

    if (opt.contactInfo.nationalCode) {
        const NationalCode = new SME.MultiLanguageProperty({
            idShort: 'NationalCode',
            semanticId: GenerateChildSemanticId({
                parent: smcSemanticId,
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO134#002'
                    }
                ]
            }),
            description: [
                {
                    language: 'en',
                    text: 'code of a country'
                }
            ],
            value: opt.contactInfo.nationalCode
        });
        smcvals.push(NationalCode);
    }

    const ContactInformation = new SME.SubmodelElementCollection({
        idShort: 'ContactInformation' + opt.idShortExtention,
        semanticId: smcSemanticId,
        description: [
            {
                language: 'en',
                text: 'The SMC “ContactInformation” contains information on how to contact\
 the manufacturer or an authorised service provider, e.g. when a maintenance service is required'
            }
        ],
        values: smcvals
    });
    return ContactInformation;
}

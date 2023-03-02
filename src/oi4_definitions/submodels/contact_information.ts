import { LangStringSet } from '../primitive_data_types';
import { submodel_elements as SME } from '../submodel_elements';
import { SubmodelElement } from '../aas_components';

//actuall submodel implementation missing

function pad(i: number) {
    const zeros = '00';
    const conc = zeros + i;
    return conc.slice(conc.length - zeros.length);
}

export function contactInformationToSMC(
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
    },
    idShortExtention?: string
): SME.SubmodelElementCollection {
    let smcvals: Array<SubmodelElement> = [];
    if (contactInfo.street) {
        const Street = new SME.MultiLanguageProperty({
            idShort: 'Street',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO128#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'street name and house number'
                }
            ],
            value: contactInfo.street
        });
        smcvals.push(Street);
    }

    if (contactInfo.street) {
        const Zipocode = new SME.MultiLanguageProperty({
            idShort: 'Zipcode',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO129#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'ZIP code of address'
                }
            ],
            value: contactInfo.zipcode
        });
        smcvals.push(Zipocode);
    }

    if (contactInfo.cityTown) {
        const CityTown = new SME.MultiLanguageProperty({
            idShort: 'CityTown',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO132#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'town or city'
                }
            ],
            value: contactInfo.cityTown
        });
        smcvals.push(CityTown);
    }

    if (contactInfo.nationalCode) {
        const NationalCode = new SME.MultiLanguageProperty({
            idShort: 'NationalCode',
            semanticId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'MultiLanguageProperty',
                        value: '[IRDI] 0173-1#02-AAO134#002'
                    }
                ]
            },
            description: [
                {
                    language: 'en',
                    text: 'code of a country'
                }
            ],
            value: contactInfo.nationalCode
        });
        smcvals.push(NationalCode);
    }

    const ContactInformation = new SME.SubmodelElementCollection({
        idShort: 'ContactInformation' + idShortExtention,
        semanticId: {
            type: 'GlobalReference',
            keys: [
                {
                    type: 'SubmodelElementCollection',
                    value: '[IRI] https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation'
                }
            ]
        },
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

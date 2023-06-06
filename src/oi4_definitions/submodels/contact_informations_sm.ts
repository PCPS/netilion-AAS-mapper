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

function Generate_SMC_Phone(
    opt: {
        TelephoneNumber: LangStringSet;
        TypeOfTelephone?: string;
        AvailableTime?: LangStringSet;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    let postfix = idShort_postfix || '';
    let submodelElements: Array<SubmodelElement> = [];
    const TelephoneNumber = new MultiLanguageProperty({
        idShort: 'TelephoneNumber',
        semanticId: GetSemanticId('TelephoneNumber'),
        value: opt.TelephoneNumber
    });
    submodelElements.push(TelephoneNumber);
    if (opt.TypeOfTelephone) {
        const TypeOfTelephone = new Property({
            idShort: 'TypeOfTelephone',
            semanticId: GetSemanticId('TypeOfTelephone'),
            valueType: 'xs:string',
            value: opt.TypeOfTelephone
        });
        submodelElements.push(TypeOfTelephone);
    }
    if (opt.AvailableTime) {
        const AvailableTime = new MultiLanguageProperty({
            idShort: 'AvailableTime',
            semanticId: GetSemanticId('AvailableTime'),
            value: opt.AvailableTime
        });
        submodelElements.push(AvailableTime);
    }
    const result = new SubmodelElementCollection({
        idShort: 'Phone' + postfix,
        semanticId: GetSemanticId('Phone'),
        value: submodelElements
    });
    return result;
}
function Generate_SMC_Fax(
    opt: {
        FaxNumber: LangStringSet;
        TypeOfFaxNumber?: string;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    let postfix = idShort_postfix || '';
    let submodelElements: Array<SubmodelElement> = [];
    const FaxNumber = new MultiLanguageProperty({
        idShort: 'FaxNumber',
        semanticId: GetSemanticId('FaxNumber'),
        value: opt.FaxNumber
    });
    submodelElements.push(FaxNumber);
    if (opt.TypeOfFaxNumber) {
        const TypeOfFaxNumber = new Property({
            idShort: 'TypeOfFaxNumber',
            semanticId: GetSemanticId('TypeOfFaxNumber'),
            valueType: 'xs:string',
            value: opt.TypeOfFaxNumber
        });
        submodelElements.push(TypeOfFaxNumber);
    }
    const result = new SubmodelElementCollection({
        idShort: 'Fax' + postfix,
        semanticId: GetSemanticId('Fax'),
        value: submodelElements
    });
    return result;
}
function Generate_SMC_Email(
    opt: {
        EmailAddress: string;
        PublicKey?: LangStringSet;
        TypeOfEmailAddress?: string;
        TypeOfPublicKey?: LangStringSet;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    let postfix = idShort_postfix || '';
    let submodelElements: Array<SubmodelElement> = [];
    const EmailAddress = new Property({
        idShort: 'EmailAddress',
        semanticId: GetSemanticId('EmailAddress'),
        valueType: 'xs:string',
        value: opt.EmailAddress
    });
    submodelElements.push(EmailAddress);
    if (opt.PublicKey) {
        const PublicKey = new MultiLanguageProperty({
            idShort: 'PublicKey',
            semanticId: GetSemanticId('PublicKey'),
            value: opt.PublicKey
        });
        submodelElements.push(PublicKey);
    }
    if (opt.TypeOfEmailAddress) {
        const TypeOfEmailAddress = new Property({
            idShort: 'TypeOfEmailAddress',
            semanticId: GetSemanticId('TypeOfEmailAddress'),
            valueType: 'xs:string',
            value: opt.TypeOfEmailAddress
        });
        submodelElements.push(TypeOfEmailAddress);
    }
    if (opt.TypeOfPublicKey) {
        const TypeOfPublicKey = new MultiLanguageProperty({
            idShort: 'TypeOfPublicKey',
            semanticId: GetSemanticId('TypeOfPublicKey'),
            value: opt.TypeOfPublicKey
        });
        submodelElements.push(TypeOfPublicKey);
    }
    const result = new SubmodelElementCollection({
        idShort: 'Email' + postfix,
        semanticId: GetSemanticId('Email'),
        value: submodelElements
    });
    return result;
}
function Generate_SMC_IPCommunication(
    opt: {
        AddressOfAdditionalLink: string;
        TypeOfCommunication?: string;
        AvailableTime?: LangStringSet;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    let postfix = idShort_postfix || '';
    let submodelElements: Array<SubmodelElement> = [];
    const AddressOfAdditionalLink = new Property({
        idShort: 'AddressOfAdditionalLink',
        semanticId: GetSemanticId('AddressOfAdditionalLink'),
        valueType: 'xs:string',
        value: opt.AddressOfAdditionalLink
    });
    submodelElements.push(AddressOfAdditionalLink);
    if (opt.TypeOfCommunication) {
        const TypeOfCommunication = new Property({
            idShort: 'TypeOfCommunication',
            semanticId: GetSemanticId('TypeOfCommunication'),
            valueType: 'xs:string',
            value: opt.TypeOfCommunication
        });
        submodelElements.push(TypeOfCommunication);
    }
    if (opt.AvailableTime) {
        const AvailableTime = new MultiLanguageProperty({
            idShort: 'AvailableTime',
            semanticId: GetSemanticId('AvailableTime'),
            value: opt.AvailableTime
        });
        submodelElements.push(AvailableTime);
    }
    const result = new SubmodelElementCollection({
        idShort: 'IPCommunication' + postfix,
        semanticId: GetSemanticId('IPCommunication'),
        value: submodelElements
    });
    return result;
}
function Generate_SMC_ContactInformation(
    opt: {
        RoleOfContactPerson?: string;
        NationalCode: LangStringSet;
        Language?: Array<string>;
        TimeZone?: string;
        CityTown: LangStringSet;
        Company?: LangStringSet;
        Department?: LangStringSet;
        Phone?: {
            TelephoneNumber: LangStringSet;
            TypeOfTelephone?: string;
            AvailableTime?: LangStringSet;
        };
        Fax?: {
            FaxNumber: LangStringSet;
            TypeOfFaxNumber?: string;
        };
        Email?: {
            EmailAddress: string;
            PublicKey?: LangStringSet;
            TypeOfEmailAddress?: string;
            TypeOfPublicKey?: LangStringSet;
        };
        IPCommunication?: Array<{
            AddressOfAdditionalLink: string;
            TypeOfCommunication?: string;
            AvailableTime?: LangStringSet;
        }>;
        Street: LangStringSet;
        Zipcode: LangStringSet;
        POBox?: LangStringSet;
        ZipCodeOfPOBox?: LangStringSet;
        StateCounty?: LangStringSet;
        NameOfContact?: LangStringSet;
        FirstName?: LangStringSet;
        MiddleNames?: LangStringSet;
        Title?: LangStringSet;
        AcademicTitle?: LangStringSet;
        FurtherDetailsOfContact?: LangStringSet;
        AddressOfAdditionalLink?: string;
    },
    idShort_postfix?: string
): SubmodelElementCollection {
    let postfix = idShort_postfix || '';
    let submodelElements: Array<SubmodelElement> = [];
    if (opt.RoleOfContactPerson) {
        const RoleOfContactPerson = new Property({
            idShort: 'RoleOfContactPerson',
            semanticId: GetSemanticId('RoleOfContactPerson'),
            valueType: 'xs:string',
            value: opt.RoleOfContactPerson
        });
        submodelElements.push(RoleOfContactPerson);
    }
    const NationalCode = new MultiLanguageProperty({
        idShort: 'NationalCode',
        semanticId: GetSemanticId('NationalCode'),
        value: opt.NationalCode
    });
    submodelElements.push(NationalCode);
    if (opt.Language) {
        opt.Language.forEach((item, i) => {
            const Language = new Property({
                idShort: 'Language{' + number_to_padded_string(i, 3) + '}',
                semanticId: GetSemanticId('Language'),
                valueType: 'xs:string',
                value: item
            });
            submodelElements.push(Language);
        });
    }
    if (opt.TimeZone) {
        const TimeZone = new Property({
            idShort: 'TimeZone',
            semanticId: GetSemanticId('TimeZone'),
            valueType: 'xs:string',
            value: opt.TimeZone
        });
        submodelElements.push(TimeZone);
    }
    const CityTown = new MultiLanguageProperty({
        idShort: 'CityTown',
        semanticId: GetSemanticId('CityTown'),
        value: opt.CityTown
    });
    submodelElements.push(CityTown);
    if (opt.Company) {
        const Company = new MultiLanguageProperty({
            idShort: 'Company',
            semanticId: GetSemanticId('Company'),
            value: opt.Company
        });
        submodelElements.push(Company);
    }
    if (opt.Department) {
        const Department = new MultiLanguageProperty({
            idShort: 'Department',
            semanticId: GetSemanticId('Department'),
            value: opt.Department
        });
        submodelElements.push(Department);
    }
    if (opt.Phone) {
        const Phone = Generate_SMC_Phone(opt.Phone);
        submodelElements.push(Phone);
    }
    if (opt.Fax) {
        const Fax = Generate_SMC_Fax(opt.Fax);
        submodelElements.push(Fax);
    }
    if (opt.Email) {
        const Email = Generate_SMC_Email(opt.Email);
        submodelElements.push(Email);
    }
    if (opt.IPCommunication) {
        opt.IPCommunication.forEach((item, i) => {
            const IPCommunication = Generate_SMC_IPCommunication(item);
            submodelElements.push(IPCommunication);
        });
    }
    const Street = new MultiLanguageProperty({
        idShort: 'Street',
        semanticId: GetSemanticId('Street'),
        value: opt.Street
    });
    submodelElements.push(Street);
    const Zipcode = new MultiLanguageProperty({
        idShort: 'Zipcode',
        semanticId: GetSemanticId('Zipcode'),
        value: opt.Zipcode
    });
    submodelElements.push(Zipcode);
    if (opt.POBox) {
        const POBox = new MultiLanguageProperty({
            idShort: 'POBox',
            semanticId: GetSemanticId('POBox'),
            value: opt.POBox
        });
        submodelElements.push(POBox);
    }
    if (opt.ZipCodeOfPOBox) {
        const ZipCodeOfPOBox = new MultiLanguageProperty({
            idShort: 'ZipCodeOfPOBox',
            semanticId: GetSemanticId('ZipCodeOfPOBox'),
            value: opt.ZipCodeOfPOBox
        });
        submodelElements.push(ZipCodeOfPOBox);
    }
    if (opt.StateCounty) {
        const StateCounty = new MultiLanguageProperty({
            idShort: 'StateCounty',
            semanticId: GetSemanticId('StateCounty'),
            value: opt.StateCounty
        });
        submodelElements.push(StateCounty);
    }
    if (opt.NameOfContact) {
        const NameOfContact = new MultiLanguageProperty({
            idShort: 'NameOfContact',
            semanticId: GetSemanticId('NameOfContact'),
            value: opt.NameOfContact
        });
        submodelElements.push(NameOfContact);
    }
    if (opt.FirstName) {
        const FirstName = new MultiLanguageProperty({
            idShort: 'FirstName',
            semanticId: GetSemanticId('FirstName'),
            value: opt.FirstName
        });
        submodelElements.push(FirstName);
    }
    if (opt.MiddleNames) {
        const MiddleNames = new MultiLanguageProperty({
            idShort: 'MiddleNames',
            semanticId: GetSemanticId('MiddleNames'),
            value: opt.MiddleNames
        });
        submodelElements.push(MiddleNames);
    }
    if (opt.Title) {
        const Title = new MultiLanguageProperty({
            idShort: 'Title',
            semanticId: GetSemanticId('Title'),
            value: opt.Title
        });
        submodelElements.push(Title);
    }
    if (opt.AcademicTitle) {
        const AcademicTitle = new MultiLanguageProperty({
            idShort: 'AcademicTitle',
            semanticId: GetSemanticId('AcademicTitle'),
            value: opt.AcademicTitle
        });
        submodelElements.push(AcademicTitle);
    }
    if (opt.FurtherDetailsOfContact) {
        const FurtherDetailsOfContact = new MultiLanguageProperty({
            idShort: 'FurtherDetailsOfContact',
            semanticId: GetSemanticId('FurtherDetailsOfContact'),
            value: opt.FurtherDetailsOfContact
        });
        submodelElements.push(FurtherDetailsOfContact);
    }
    if (opt.AddressOfAdditionalLink) {
        const AddressOfAdditionalLink = new Property({
            idShort: 'AddressOfAdditionalLink',
            semanticId: GetSemanticId('AddressOfAdditionalLink'),
            valueType: 'xs:string',
            value: opt.AddressOfAdditionalLink
        });
        submodelElements.push(AddressOfAdditionalLink);
    }
    const result = new SubmodelElementCollection({
        idShort: 'ContactInformation' + postfix,
        semanticId: GetSemanticId('ContactInformation'),
        value: submodelElements
    });
    return result;
}
export function Generate_SM_ContactInformations(
    opt: {
        ContactInformation: Array<{
            RoleOfContactPerson?: string;
            NationalCode: LangStringSet;
            Language?: Array<string>;
            TimeZone?: string;
            CityTown: LangStringSet;
            Company?: LangStringSet;
            Department?: LangStringSet;
            Phone?: {
                TelephoneNumber: LangStringSet;
                TypeOfTelephone?: string;
                AvailableTime?: LangStringSet;
            };
            Fax?: {
                FaxNumber: LangStringSet;
                TypeOfFaxNumber?: string;
            };
            Email?: {
                EmailAddress: string;
                PublicKey?: LangStringSet;
                TypeOfEmailAddress?: string;
                TypeOfPublicKey?: LangStringSet;
            };
            IPCommunication?: Array<{
                AddressOfAdditionalLink: string;
                TypeOfCommunication?: string;
                AvailableTime?: LangStringSet;
            }>;
            Street: LangStringSet;
            Zipcode: LangStringSet;
            POBox?: LangStringSet;
            ZipCodeOfPOBox?: LangStringSet;
            StateCounty?: LangStringSet;
            NameOfContact?: LangStringSet;
            FirstName?: LangStringSet;
            MiddleNames?: LangStringSet;
            Title?: LangStringSet;
            AcademicTitle?: LangStringSet;
            FurtherDetailsOfContact?: LangStringSet;
            AddressOfAdditionalLink?: string;
        }>;
    },
    id: string,
    idShort_postfix?: string
): Submodel {
    let postfix = idShort_postfix || '';
    let submodelElements: Array<SubmodelElement> = [];
    opt.ContactInformation.forEach((item, i) => {
        const ContactInformation = Generate_SMC_ContactInformation(item);
        submodelElements.push(ContactInformation);
    });
    const result = new Submodel({
        id: id,
        idShort: 'ContactInformations' + postfix,
        semanticId: GetSemanticId('ContactInformations'),
        submodelElements: submodelElements
    });
    return result;
}

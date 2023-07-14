import { Reference, SpecificAssetId, Submodel } from '../aas_components';
import { ContentType, DataTypeDefXsd, LangStringSet, PathType, ValueDataType, EntityType, Identifier } from '../primitive_data_types';
import { SubmodelElementCollection, Property, MultiLanguageProperty, ReferenceElement, File, Entity } from '../submodel_elements';
import { xs } from '../xs_data_types';
import { SubmodelElement } from '../aas_components';
import { GetSemanticId } from '../../services/oi4_helpers';import { number_to_padded_string } from '../../services/oi4_helpers';

function Generate_SMC_Phone(opt: {
    TelephoneNumber: LangStringSet
    TypeOfTelephone?: string
    AvailableTime?: LangStringSet
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const TelephoneNumber = new MultiLanguageProperty({
        idShort: 'TelephoneNumber',
        value: opt.TelephoneNumber
    });
    submodelElements.push(TelephoneNumber)
    if (opt.TypeOfTelephone) {
        const TypeOfTelephone = new Property({
            idShort: 'TypeOfTelephone',
            valueType: 'xs:string',
            value: opt.TypeOfTelephone
        });
        submodelElements.push(TypeOfTelephone)
    }
    if (opt.AvailableTime) {
        const AvailableTime = new MultiLanguageProperty({
            idShort: 'AvailableTime',
            value: opt.AvailableTime
        });
        submodelElements.push(AvailableTime)
    }
    const result = new SubmodelElementCollection({
        idShort: 'Phone' + postfix,
        value: submodelElements
    });
    return result
}
function Generate_SMC_Fax(opt: {
    FaxNumber: LangStringSet
    TypeOfFaxNumber?: string
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const FaxNumber = new MultiLanguageProperty({
        idShort: 'FaxNumber',
        value: opt.FaxNumber
    });
    submodelElements.push(FaxNumber)
    if (opt.TypeOfFaxNumber) {
        const TypeOfFaxNumber = new Property({
            idShort: 'TypeOfFaxNumber',
            valueType: 'xs:string',
            value: opt.TypeOfFaxNumber
        });
        submodelElements.push(TypeOfFaxNumber)
    }
    const result = new SubmodelElementCollection({
        idShort: 'Fax' + postfix,
        value: submodelElements
    });
    return result
}
function Generate_SMC_Email(opt: {
    EmailAddress: string
    PublicKey?: LangStringSet
    TypeOfEmailAddress?: string
    TypeOfPublicKey?: LangStringSet
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const EmailAddress = new Property({
        idShort: 'EmailAddress',
        valueType: 'xs:string',
        value: opt.EmailAddress
    });
    submodelElements.push(EmailAddress)
    if (opt.PublicKey) {
        const PublicKey = new MultiLanguageProperty({
            idShort: 'PublicKey',
            value: opt.PublicKey
        });
        submodelElements.push(PublicKey)
    }
    if (opt.TypeOfEmailAddress) {
        const TypeOfEmailAddress = new Property({
            idShort: 'TypeOfEmailAddress',
            valueType: 'xs:string',
            value: opt.TypeOfEmailAddress
        });
        submodelElements.push(TypeOfEmailAddress)
    }
    if (opt.TypeOfPublicKey) {
        const TypeOfPublicKey = new MultiLanguageProperty({
            idShort: 'TypeOfPublicKey',
            value: opt.TypeOfPublicKey
        });
        submodelElements.push(TypeOfPublicKey)
    }
    const result = new SubmodelElementCollection({
        idShort: 'Email' + postfix,
        value: submodelElements
    });
    return result
}
function Generate_SMC_IPCommunication(opt: {
    AddressOfAdditionalLink: string
    TypeOfCommunication?: string
    AvailableTime?: LangStringSet
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const AddressOfAdditionalLink = new Property({
        idShort: 'AddressOfAdditionalLink',
        valueType: 'xs:string',
        value: opt.AddressOfAdditionalLink
    });
    submodelElements.push(AddressOfAdditionalLink)
    if (opt.TypeOfCommunication) {
        const TypeOfCommunication = new Property({
            idShort: 'TypeOfCommunication',
            valueType: 'xs:string',
            value: opt.TypeOfCommunication
        });
        submodelElements.push(TypeOfCommunication)
    }
    if (opt.AvailableTime) {
        const AvailableTime = new MultiLanguageProperty({
            idShort: 'AvailableTime',
            value: opt.AvailableTime
        });
        submodelElements.push(AvailableTime)
    }
    const result = new SubmodelElementCollection({
        idShort: 'IPCommunication' + postfix,
        value: submodelElements
    });
    return result
}
function Generate_SMC_ContactInformation(opt: {
    RoleOfContactPerson?: string
    NationalCode: LangStringSet
    Language?: Array<string>
    TimeZone?: string
    CityTown: LangStringSet
    Company?: LangStringSet
    Department?: LangStringSet
    Phone?: {
        TelephoneNumber: LangStringSet
        TypeOfTelephone?: string
        AvailableTime?: LangStringSet
    }
    Fax?: {
        FaxNumber: LangStringSet
        TypeOfFaxNumber?: string
    }
    Email?: {
        EmailAddress: string
        PublicKey?: LangStringSet
        TypeOfEmailAddress?: string
        TypeOfPublicKey?: LangStringSet
    }
    IPCommunication?: Array<{
        AddressOfAdditionalLink: string
        TypeOfCommunication?: string
        AvailableTime?: LangStringSet
    }>
    Street: LangStringSet
    Zipcode: LangStringSet
    POBox?: LangStringSet
    ZipCodeOfPOBox?: LangStringSet
    StateCounty?: LangStringSet
    NameOfContact?: LangStringSet
    FirstName?: LangStringSet
    MiddleNames?: LangStringSet
    Title?: LangStringSet
    AcademicTitle?: LangStringSet
    FurtherDetailsOfContact?: LangStringSet
    AddressOfAdditionalLink?: string
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.RoleOfContactPerson) {
        const RoleOfContactPerson = new Property({
            idShort: 'RoleOfContactPerson',
            valueType: 'xs:string',
            value: opt.RoleOfContactPerson
        });
        submodelElements.push(RoleOfContactPerson)
    }
    const NationalCode = new MultiLanguageProperty({
        idShort: 'NationalCode',
        value: opt.NationalCode
    });
    submodelElements.push(NationalCode)
    if (opt.Language) {
        opt.Language.forEach((item, i) => {
            const Language = new Property({
                idShort: 'Language{' + number_to_padded_string(i, 3) + '}',
                valueType: 'xs:string',
                value: item
            });
            submodelElements.push(Language)
        });
    }
    if (opt.TimeZone) {
        const TimeZone = new Property({
            idShort: 'TimeZone',
            valueType: 'xs:string',
            value: opt.TimeZone
        });
        submodelElements.push(TimeZone)
    }
    const CityTown = new MultiLanguageProperty({
        idShort: 'CityTown',
        value: opt.CityTown
    });
    submodelElements.push(CityTown)
    if (opt.Company) {
        const Company = new MultiLanguageProperty({
            idShort: 'Company',
            value: opt.Company
        });
        submodelElements.push(Company)
    }
    if (opt.Department) {
        const Department = new MultiLanguageProperty({
            idShort: 'Department',
            value: opt.Department
        });
        submodelElements.push(Department)
    }
    if (opt.Phone) {
        const Phone = Generate_SMC_Phone(opt.Phone)
        submodelElements.push(Phone)
    }
    if (opt.Fax) {
        const Fax = Generate_SMC_Fax(opt.Fax)
        submodelElements.push(Fax)
    }
    if (opt.Email) {
        const Email = Generate_SMC_Email(opt.Email)
        submodelElements.push(Email)
    }
    if (opt.IPCommunication) {
        opt.IPCommunication.forEach((item, i) => {
            const IPCommunication = Generate_SMC_IPCommunication(item)
            submodelElements.push(IPCommunication)
        });
    }
    const Street = new MultiLanguageProperty({
        idShort: 'Street',
        value: opt.Street
    });
    submodelElements.push(Street)
    const Zipcode = new MultiLanguageProperty({
        idShort: 'Zipcode',
        value: opt.Zipcode
    });
    submodelElements.push(Zipcode)
    if (opt.POBox) {
        const POBox = new MultiLanguageProperty({
            idShort: 'POBox',
            value: opt.POBox
        });
        submodelElements.push(POBox)
    }
    if (opt.ZipCodeOfPOBox) {
        const ZipCodeOfPOBox = new MultiLanguageProperty({
            idShort: 'ZipCodeOfPOBox',
            value: opt.ZipCodeOfPOBox
        });
        submodelElements.push(ZipCodeOfPOBox)
    }
    if (opt.StateCounty) {
        const StateCounty = new MultiLanguageProperty({
            idShort: 'StateCounty',
            value: opt.StateCounty
        });
        submodelElements.push(StateCounty)
    }
    if (opt.NameOfContact) {
        const NameOfContact = new MultiLanguageProperty({
            idShort: 'NameOfContact',
            value: opt.NameOfContact
        });
        submodelElements.push(NameOfContact)
    }
    if (opt.FirstName) {
        const FirstName = new MultiLanguageProperty({
            idShort: 'FirstName',
            value: opt.FirstName
        });
        submodelElements.push(FirstName)
    }
    if (opt.MiddleNames) {
        const MiddleNames = new MultiLanguageProperty({
            idShort: 'MiddleNames',
            value: opt.MiddleNames
        });
        submodelElements.push(MiddleNames)
    }
    if (opt.Title) {
        const Title = new MultiLanguageProperty({
            idShort: 'Title',
            value: opt.Title
        });
        submodelElements.push(Title)
    }
    if (opt.AcademicTitle) {
        const AcademicTitle = new MultiLanguageProperty({
            idShort: 'AcademicTitle',
            value: opt.AcademicTitle
        });
        submodelElements.push(AcademicTitle)
    }
    if (opt.FurtherDetailsOfContact) {
        const FurtherDetailsOfContact = new MultiLanguageProperty({
            idShort: 'FurtherDetailsOfContact',
            value: opt.FurtherDetailsOfContact
        });
        submodelElements.push(FurtherDetailsOfContact)
    }
    if (opt.AddressOfAdditionalLink) {
        const AddressOfAdditionalLink = new Property({
            idShort: 'AddressOfAdditionalLink',
            valueType: 'xs:string',
            value: opt.AddressOfAdditionalLink
        });
        submodelElements.push(AddressOfAdditionalLink)
    }
    const result = new SubmodelElementCollection({
        idShort: 'ContactInformation' + postfix,
        value: submodelElements
    });
    return result
}
export function Generate_SM_ContactInformations(opt: {
    ContactInformation: Array<{
        RoleOfContactPerson?: string
        NationalCode: LangStringSet
        Language?: Array<string>
        TimeZone?: string
        CityTown: LangStringSet
        Company?: LangStringSet
        Department?: LangStringSet
        Phone?: {
            TelephoneNumber: LangStringSet
            TypeOfTelephone?: string
            AvailableTime?: LangStringSet
        }
        Fax?: {
            FaxNumber: LangStringSet
            TypeOfFaxNumber?: string
        }
        Email?: {
            EmailAddress: string
            PublicKey?: LangStringSet
            TypeOfEmailAddress?: string
            TypeOfPublicKey?: LangStringSet
        }
        IPCommunication?: Array<{
            AddressOfAdditionalLink: string
            TypeOfCommunication?: string
            AvailableTime?: LangStringSet
        }>
        Street: LangStringSet
        Zipcode: LangStringSet
        POBox?: LangStringSet
        ZipCodeOfPOBox?: LangStringSet
        StateCounty?: LangStringSet
        NameOfContact?: LangStringSet
        FirstName?: LangStringSet
        MiddleNames?: LangStringSet
        Title?: LangStringSet
        AcademicTitle?: LangStringSet
        FurtherDetailsOfContact?: LangStringSet
        AddressOfAdditionalLink?: string
    }>
}, id: string,
idShort_postfix?: string ): Submodel {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    opt.ContactInformation.forEach((item, i) => {
        const ContactInformation = Generate_SMC_ContactInformation(item)
        submodelElements.push(ContactInformation)
    });
    const result = new Submodel({
        id: id,
        idShort: 'ContactInformations' + postfix,
        submodelElements: submodelElements
    });
    return result
}
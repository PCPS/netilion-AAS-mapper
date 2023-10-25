import {
    AdministrativeInformation,
    Reference,
    SpecificAssetId
} from './aas_components';
import { AssetKind, Identifier, NameType } from './primitive_data_types';

type IdShortType = NameType;

interface Endpoint {
    protocolInformation: ProtocolInformation;
    interface: IdShortType;
}

enum SecurtiyTypeEnum {
    NONE = 'NONE',
    RFC_TLSA = 'RFC_TLSA',
    W3C_DID = 'W3C_DID'
}

interface SecurityAttributeObject {
    type: SecurtiyTypeEnum;
    key: string;
    value: string;
}

interface ProtocolInformation {
    href: string;
    endpointProtocol: IdShortType;
    endpointProtocolVersion: IdShortType;
    subProtocol: IdShortType;
    subProtocolBody: IdShortType;
    subProtocolBodyEncoding: IdShortType;
    securityAttributes: SecurityAttributeObject;
}

export interface AssetAdministrationShellDescriptor {
    administration: AdministrativeInformation;
    assetKind: AssetKind;
    assetType: Identifier;
    endpoint: Endpoint;
    globalAssetId: Identifier;
    idShort: NameType;
    id: Identifier;
    specificAssetId: Array<SpecificAssetId>;
    submodelDescriptor: Array<SubmodelDescriptor>;
}

export interface SubmodelDescriptor {
    administration: AdministrativeInformation;
    endpoint: Endpoint;
    idShort: NameType;
    id: Identifier;
    semanticId: Reference;
    supplementalSemanticId: Array<Reference>;
}

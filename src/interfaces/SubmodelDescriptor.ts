export interface SubmodelDescriptor {
    endpoints: Endpoint[];
    identification: Identification;
}

interface Identification {
    id: string;
    idType: string;
}

interface Endpoint {
    protocolInformation: ProtocolInformation;
    interface: string;
}

interface ProtocolInformation {
    endpointAddress: string;
    endpointProtocol: string;
    endpointProtocolVersion?: string;
    subprotocol?: string;
    subprotocolBody?: string;
    subprotocolBodyEncoding?: string;
}

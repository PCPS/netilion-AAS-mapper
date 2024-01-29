interface Import_Descriptor_Base {
    name?: string;
    path: string;
}

interface Import_Descriptor_Import_Some extends Import_Descriptor_Base {
    import_all: false;
    imported_names: Array<string>;
}

interface Import_Descriptor_Import_All extends Import_Descriptor_Base {
    name: string;
    import_all: true;
}

type Import_Descriptor =
    | Import_Descriptor_Import_All
    | Import_Descriptor_Import_Some;

type BaseHeadersType = { [key: string]: string };

type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

type BasicTypeName = 'number' | 'string' | 'boolean';

interface Api_Parameter_Descriptor {
    name: string;
    type: BasicTypeName;
}

interface Api_Url_Descriptor {
    relative?: boolean;
    value: string;
}

type ApiHeadersType = BaseHeadersType | 'inherit';

interface Endpoint_Descroptor {
    name: string;
    params?: Array<Api_Parameter_Descriptor>;
    returns: string;
    headers: ApiHeadersType;
    response_type: string;
    url: Api_Url_Descriptor;
    method: MethodType;
}

interface Client_Descriptor {
    name: string;
    base_url: string;
    headers: BaseHeadersType;
    imports: Array<Import_Descriptor>;
    endpoints: Array<Endpoint_Descroptor>;
}

export interface Map_Descriptor {
    environment_variables: Array<string>;
    clients: Array<Client_Descriptor>;
}

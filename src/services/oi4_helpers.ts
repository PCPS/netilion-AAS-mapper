import {
    DataSpecificationIEC61360,
    Reference
} from '../oi4_definitions/aas_components';
import model_semantics from '../dictionaries/model_semantics.json';
import {
    KeyTypes,
    ReferenceTypes
} from '../oi4_definitions/primitive_data_types';
import fs from 'fs';
import path from 'path';
import DataSpecificationInput from '../interfaces/DataSpecificationInput';

// convert from index number to a zero-padded number in string format.
// used as postfix to idShort of recurrent submodel elements
// example: (1) => '01', (5, 3) => '005', (24, 3) => '024',
export function number_to_padded_string(i: number, width?: number) {
    let w = width || 2;
    const zeros = '0'.repeat(w);
    const conc = zeros + i;
    return conc.slice(conc.length - zeros.length);
}

// retrieve semantic ID of an element via its idShort from a list of semantic IDs from a JSON file.
export function GetSemanticId(idShort: string): Reference {
    const models = model_semantics.models as { [key: string]: any };
    const referenceTypes = model_semantics.referenceTypes as ReferenceTypes[];
    const keyTypes = model_semantics.keyTypes as KeyTypes[];
    let modelNames = Object.keys(models);
    if (modelNames.includes(idShort)) {
        let semanticId = models[idShort].semanticId;
        let type = referenceTypes[semanticId.type];
        let keys = semanticId.keys.map((e: any) => {
            return { type: keyTypes[e.type], value: e.value };
        });
        return new Reference({ type, keys });
    } else {
        return new Reference({ type: 'ExternalReference', keys: [] });
    }
}

// Serilize Object 'obj' to desired output format using Objects 'modifyKeys' and 'appendKeys'.
// modifyKeys and appendKeys are mappings from keys to functions on obj.
// modifyKeys only contains keys found in obj and appendKeys only contains unique keys that do not exist in obj
export function Serialize(
    obj: { [key: string]: any },
    modifyKeys: any,
    appendKeys: any
): any {
    let serialized = Object.assign({}, obj);
    let objProps = Object.getOwnPropertyNames(serialized);
    let modProps = Object.getOwnPropertyNames(modifyKeys);
    let addProps = Object.getOwnPropertyNames(appendKeys);
    objProps
        .filter((prop) => {
            return modProps.includes(prop);
        })
        .forEach((prop) => {
            serialized[prop] = modifyKeys[prop](obj);
        });
    addProps.forEach((prop) => {
        serialized[prop] = appendKeys[prop](obj);
    });
}

//create ConceptDescription elements from eclass JSON dictionary
export function GenerateDescriptionsFromEclass() {
    let eclass = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../dictionary/ECLASS.json'),
            'utf8'
        )
    )['dic:eclass_dictionary']['ontoml:ontoml'].dictionary;
    // let classes = eclass.contained_classes['ontoml:class'];
    // let relationships =
    //     eclass.a_posteriori_semantic_relationships[
    //         'ontoml:a_posteriori_semantic_relationship'
    //     ];
    let properties = eclass.contained_properties['ontoml:property'];
    // let dataTypes = eclass.contained_datatypes['ontoml:datatype'];

    let models = model_semantics.models;

    let semanticIds = Object.keys(models).map((k: string) => {
        let id = models[k as keyof typeof models].semanticId.keys[0].value;
        return { id, name: k };
    });
    let irdis = semanticIds
        .filter((item: { [key: string]: string }) => {
            return item.id.split(' ')[0] === '[IRDI]';
        })
        .map((item: { [key: string]: string }) => {
            let irdi = item.id.split(' ')[1];
            return irdi;
        });
    let dataSpecContents = irdis.map((item: string) => {
        let found = properties.find((p: any) => {
            return p._attributes.id == item;
        });
        let name = semanticIds.find((sid: { [key: string]: string }) => {
            return sid.id.split(' ')[1] == item;
        })?.name;
        let id = semanticIds
            .find((sid: { [key: string]: string }) => {
                return sid.id.split(' ')[1] == item;
            })
            ?.id.split(' ')[1];
        if (found) {
            return {
                name,
                id,
                found: true
            };
        } else {
            return {
                name,
                id,
                found: false
            };
        }
    });
    let propDescIrdi = properties.map((item: any) => {
        let irdi = item._attributes.id;
        return irdi;
    });

    console.log(dataSpecContents);
}

// Create embedded data specification elements from data specification references
// export function GetEmbeddedDataSpec(obj: { [key: string]: any }): any {
//     let dataSpecs = obj.dataSpecifications;
//     dataSpecs.
//     let embeddedDataSpecs = dataSpecs.map((item: Reference) => {return {dataSpecificationContent: new DataSpecificationIEC61360(), dataSpecification: item}})
// }

// Encode string to Base64 (by default from utf8)
export function makeBase64(str: string, encodeing: BufferEncoding = 'utf8') {
    const buffer = Buffer.from(str, encodeing);
    return buffer.toString('base64');
}

// Decode string from Base64 (by default to utf8)
export function decodeBase64(str: string, encodeTo: BufferEncoding = 'utf8') {
    const buffer = Buffer.from(str, 'base64');
    return buffer.toString(encodeTo);
}

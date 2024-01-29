import { Reference } from './aas_components';
import model_semantics from '../dictionaries/model_semantics.json';
import { KeyTypes, ReferenceTypes } from './primitive_data_types';
import fs from 'fs';
import path from 'path';
import DataSpecificationTemplates from './interfaces/data_specification_interfaces';

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
// Serialize Object 'obj' to desired output format using Objects 'modifyKeys' and 'removeKeys'.
// modifyKeys is a mapping from keys to functions on obj.
// removeKeys is a list of keys that, if included in obj, will be removed from it along with their value.
// Serialization method must be defined per class by adding a 'serialize()' method to the class.
// Serialization is recursive and applize to all properties of class.

export function Serialize<T>(
    obj: T,
    opt: {
        modifyKeys?: { [key: string]: (arg: T) => any }; // add or modify keys in obj with the function they are assigned to in this object.
        removeKeys?: Array<string>; // list of keys to remove from obj.
    }
): any {
    let serialized: any = {};
    let objProps = Object.getOwnPropertyNames(obj);
    let modProps = Object.getOwnPropertyNames(opt.modifyKeys);
    let remProps = opt.removeKeys;

    objProps
        .filter((prop) => {
            return !remProps?.includes(prop) && !modProps?.includes(prop);
        })
        .forEach((prop) => {
            serialized[prop] = obj[prop as keyof T];
        });
    if (opt.modifyKeys) {
        modProps
            .filter((prop) => {
                return !remProps?.includes(prop);
            })
            .forEach((prop) => {
                serialized[prop] = opt.modifyKeys![prop](obj);
            });
    }
    let serProps = Object.getOwnPropertyNames(serialized);
    serProps.forEach((prop) => {
        if (serialized[prop]) {
            if (typeof serialized[prop].serialize === 'function') {
                serialized[prop] = serialized[prop].serialize();
            }
        }
    });
    return serialized;
}

// export function RealizeDataSpecificationReferenceL(ref: Reference) {
//     assert(false);
// }

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
            return item.id.startsWith('0173') || item.id.startsWith('0112');
        })
        .map((item: { [key: string]: string }) => {
            return item.id;
        });
    let dataSpecContents = irdis.map((item: string) => {
        let found = properties.find((p: any) => {
            return p._attributes.id == item;
        });
        let name = semanticIds.find((sid: { [key: string]: string }) => {
            return sid.id == item;
        })?.name;
        let id = semanticIds.find((sid: { [key: string]: string }) => {
            return sid.id == item;
        })?.id;
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
//     let embeddedDataSpecs = dataSpecs.map((item: Reference) => {return {dataSpecificationContent: new DataSpecificationIec61360(), dataSpecification: item}})
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

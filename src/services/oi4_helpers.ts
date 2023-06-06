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
import convert from 'xml-js';

export function number_to_padded_string(i: number, width?: number) {
    let w = width || 2;
    const zeros = '0'.repeat(w);
    const conc = zeros + i;
    return conc.slice(conc.length - zeros.length);
}

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

export function GenerateEclassFromXml() {
    let xml = fs.readFileSync(
        path.join(__dirname, '../dictionary/ECLASS12_0_ADVANCED_EN_SG_27.xml'),
        'utf8'
    );
    let eclass = convert.xml2json(xml, {
        compact: true,
        spaces: 4,
        ignoreComment: true
    });
    fs.writeFileSync(path.join(__dirname, '../dictionary/ECLASS.json'), eclass);
}

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
// export function GetEmbeddedDataSpec(obj: { [key: string]: any }): any {
//     let dataSpecs = obj.dataSpecifications;
//     dataSpecs.
//     let embeddedDataSpecs = dataSpecs.map((item: Reference) => {return {dataSpecificationContent: new DataSpecificationIEC61360(), dataSpecification: item}})
// }

export function makeBase64(str: string, encodeing: BufferEncoding = 'utf8') {
    const buffer = Buffer.from(str, encodeing);
    return buffer.toString('base64');
}

export function decodeBase64(str: string, encodeTo: BufferEncoding = 'utf8') {
    const buffer = Buffer.from(str, 'base64');
    return buffer.toString(encodeTo);
}

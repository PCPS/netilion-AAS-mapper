import { Model, SmeModel, SmModel } from '../Interfaces/simplified';
import fs from 'fs';
import path from 'path';
import convert from 'xml-js';

// Set the following variable to the name of the ECLASS advance dictionary file in 'dictionaries' directory
const ECLASS_XML_FILE_NAME = 'ECLASS12_0_ADVANCED_EN_SG_27.xml';

const sm_path = '../submodels/';

// Create eclass dictiononary in JSON format from xml file
export function GenerateEclassFromXml() {
    let xml_dict = fs.readFileSync(
        path.join(__dirname, '../dictionaries/' + ECLASS_XML_FILE_NAME),
        'utf8'
    );
    let eclass_dict = convert.xml2json(xml_dict, {
        compact: true,
        spaces: 4,
        ignoreComment: true
    });
    fs.writeFileSync(
        path.join(__dirname, '../../dictionaries/ECLASS.json'),
        eclass_dict
    );
    let xml_unit = fs.readFileSync(
        path.join(__dirname, '../../dictionaries/ECLASS12_0_UnitsML_EN_DE.xml'),
        'utf8'
    );
    let eclass_unit = convert.xml2json(xml_unit, {
        compact: true,
        spaces: 4,
        ignoreComment: true
    });
    fs.writeFileSync(
        path.join(__dirname, '../../dictionaries/ECLASS_UNIT.json'),
        eclass_unit
    );
}

const submodel_list: string[] = fs
    .readdirSync(path.join(__dirname, sm_path))
    .filter((item: string) => /^.+\.json$/.test(item));
console.log('Building semantic data dictionaries for the following:');
console.log(submodel_list);

const semantic_ids: any = {};
const semantic_ids_eclass: any = {};

function collector(model: Model, modelName?: string) {
    if (model.semanticId !== undefined) {
        // console.log('adding ' + model.semanticId + ' to semantic_ids');
        semantic_ids[model.semanticId] = modelName || 'ERR_NO_NAME';
        if (/^0173.*/.test(model.semanticId))
            semantic_ids_eclass[model.semanticId] = modelName || 'ERR_NO_NAME';
    }
    if (model.modelType === 'Submodel') {
        const sm = model as SmModel;
        const smeKeys = Object.keys(sm.submodelElements);
        smeKeys.forEach((key) => collector(sm.submodelElements[key], key));
    }
    if (model.modelType === 'SubmodelElementCollection') {
        const sm = model as SmeModel;
        const smeKeys = Object.keys(sm.value);
        smeKeys.forEach((key) => collector(sm.value[key], key));
    }
}
submodel_list.forEach((submodel_file) => {
    const submodel_container = JSON.parse(
        fs.readFileSync(path.join(__dirname, sm_path + submodel_file), 'utf8')
    );
    Object.keys(submodel_container).forEach((key) => {
        collector(submodel_container[key], key);
    });
});

// Create ConceptDescription elements from eclass JSON dictionary
export function GenerateDescriptionsFromEclass() {
    const eclass = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../../dictionaries/ECLASS.json'),
            'utf8'
        )
    )['dic:eclass_dictionary']['ontoml:ontoml'].dictionary;
    // let classes = eclass.contained_classes['ontoml:class'];
    // let relationships =
    //     eclass.a_posteriori_semantic_relationships[
    //         'ontoml:a_posteriori_semantic_relationship'
    //     ];
    const properties = eclass.contained_properties['ontoml:property'];
    // let dataTypes = eclass.contained_datatypes['ontoml:datatype'];

    const semanticIds = Object.keys(semantic_ids_eclass);
    const data_specifications: any = {};

    semanticIds.forEach((item: string) => {
        const found = properties.find((p: any) => {
            return p._attributes.id == item;
        });
        const name = semantic_ids_eclass[item];
        const id = item;
        if (found) {
            data_specifications[id] = {
                elementName: name,
                found: true,
                dataSpecificationContent: {
                    preferredName: [
                        {
                            language:
                                found.preferred_name.label._attributes
                                    .language_code,
                            text: found.preferred_name.label._text
                        }
                    ],
                    shortName: found.short_name
                        ? [
                              {
                                  language:
                                      found.short_name.label._attributes
                                          .language_code,
                                  text: found.short_name.label._text
                              }
                          ]
                        : undefined,
                    definition: [
                        {
                            language:
                                found.definition.text._attributes.language_code,
                            text: found.definition.text._text
                        }
                    ],
                    unitId: found.domain?.unit
                        ? {
                              type: 'ExternalReference',
                              keys: [
                                  {
                                      type: 'GlobalReference',
                                      value:
                                          '' +
                                          found.domain.unit._attributes.unit_ref
                                  }
                              ]
                          }
                        : undefined
                }
            };
        } else {
            data_specifications[id] = {
                elementName: name,
                found: false
            };
        }
    });
    const propDescIrdi = properties.map((item: any) => {
        const irdi = item._attributes.id;
        return irdi;
    });
    fs.writeFileSync(
        path.join(__dirname, '../../dictionaries/data_specifications.json'),
        JSON.stringify(data_specifications)
    );
}

export default {
    GenerateEclassFromXml,
    GenerateDescriptionsFromEclass
};

import fs from 'fs';
import path from 'path';

import {
    CountType,
    EntityModel,
    FileModel,
    MlpModel,
    Model,
    PropertyModel,
    ReferenceElementModel,
    SmModel,
    SmeModel
} from '../Interfaces/simplified';

//TODO: Optimise imports in CreateGenerator()

/////////////////////
//CountTypes:      //
//-----------------//
//  ! = 1          //
//  ? = [0-1]      //
//  + = [1-*]      //
//  * = [0-*]      //
/////////////////////

// Keep track of genrated functions to avoid duplicates.
// Sometimes submodels hierarchically reuse submodel elment collections or submodels.

let generated_functions: Record<string, boolean> = {};

function GetArbitraryElementName(model: Model): string {
    let suffix = 'ERROR_BAD_TYPE';
    let element_key = 'arbitrary_';
    switch (model.modelType) {
        case 'Property':
            {
                suffix = 'property';
            }
            break;
        case 'MultiLanguageProperty':
            {
                suffix = 'multi_language_property';
            }
            break;
        case 'ReferenceElement':
            {
                suffix = 'reference';
            }
            break;
        case 'File':
            {
                suffix = 'file';
            }
            break;
        case 'Entity':
            {
                suffix = 'entity';
            }
            break;
        case 'SubmodelElement': {
            suffix = 'element';
        }
    }
    if (model.count === '*' || model.count === '+') {
        suffix = suffix.replace(/s$/, 'se').replace(/y$/, 'ie') + 's';
    }
    return element_key + suffix;
}

function ExpandArbitraryElement(model: Model): string {
    let element_body = 'idShort: string\nsemanticId?: Reference';
    let element_name = GetArbitraryElementName(model);
    switch (model.modelType) {
        case 'Property':
            {
                element_body +=
                    '\nvalueType: DataTypeDefXsd' + '\nvalue: ValueDataType';
            }
            break;
        case 'MultiLanguageProperty':
            {
                element_body += '\nvalue: LangStringSet';
            }
            break;
        case 'ReferenceElement':
            {
                element_body += '\nvalue: Reference';
            }
            break;
        case 'File':
            {
                element_body +=
                    '\nvalue: PathType' + '\ncontentType: ContentType';
            }
            break;
        case 'Entity': {
            element_body +=
                '\nstatement?: Array<SubmodelElement>' +
                '\nentityType: EntityType' +
                '\nglobalAssetId?: Identifier' +
                '\nspificiAssetIds?: Array<SpecificAssetIds>';
        }
        case 'SubmodelElement':
            {
                element_body += '\nmodelType: AasSubmodelElements';
                element_body += '\nvalue: Record<string, any>';
            }
            break;
    }
    element_body = '\n' + element_body;
    element_body = '{' + element_body.replace(/\n/g, '\n    ') + '\n}';
    if (model.count === '*' || model.count === '+') {
        element_body = 'Array<' + element_body + '>';
    }
    if (model.count === '*' || model.count === '?') {
        element_name += '?';
    }
    return element_name + ': ' + element_body;
}

function GetOptProps(opt: Model, opt_count?: CountType): string {
    let script_str: string = '';
    let valueType: string = 'ERROR_UNDEFINED_TYPE';
    let count = opt_count || opt.count;
    switch (opt.modelType) {
        case 'Submodel':
            {
                let m = opt as SmModel;
                valueType = Object.keys(m.submodelElements).reduce((a, b) => {
                    if (b === '{arbitrary}') {
                        return (
                            a +
                            '\n' +
                            ExpandArbitraryElement(m.submodelElements[b])
                        );
                    } else {
                        return (
                            a +
                            '\n' +
                            (m.submodelElements[b].alias || b) +
                            GetOptProps(m.submodelElements[b])
                        );
                    }
                }, '');
            }
            valueType = valueType.replace(/\n/g, '\n    ');
            valueType = '{' + valueType + '\n}';
            break;

        case 'SubmodelElementCollection':
            {
                let m = opt as SmeModel;
                valueType = Object.keys(m.value).reduce((a, b) => {
                    if (b === '{arbitrary}') {
                        return a + '\n' + ExpandArbitraryElement(m.value[b]);
                    } else {
                        return (
                            a +
                            '\n' +
                            (m.value[b].alias || b) +
                            GetOptProps(m.value[b])
                        );
                    }
                }, '');
            }
            valueType = valueType.replace(/\n/g, '\n    ');
            valueType = '{' + valueType + '\n}';
            break;

        case 'Property':
            let m = opt as PropertyModel;
            switch (m.valueType) {
                case 'xs:string':
                    valueType = 'string';
                    break;

                case 'xs:decimal':
                    valueType = 'number';
                    break;

                case 'xs:date':
                    valueType = 'xs.date';
                    break;

                case 'xs:boolean':
                    valueType = 'boolean';
                    break;

                default:
                    valueType = 'ERROR_UNDEFINED_TYPE';
                    break;
            }
            break;

        case 'MultiLanguageProperty':
            valueType = 'LangStringSet';
            break;

        case 'ReferenceElement':
            valueType = 'Reference';
            break;

        case 'File':
            valueType = '{value?: PathType, contentType: ContentType}';
            break;

        case 'Entity':
            valueType =
                '{\n' +
                '    statements?: Array<SubmodelElement>,\n' +
                '    entityType: EntityType,\n' +
                '    globalAssetId?: Identifier,\n' +
                '    specificAssetIds?: Array<SpecificAssetId>\n' +
                '}';
            break;

        default:
            valueType = 'ERROR_UNDEFINED_TYPE';
            break;
    }
    switch (count) {
        case '!':
            script_str = ': ' + valueType + '';
            break;

        case '?':
            script_str = '?: ' + valueType + '';
            break;

        case '+':
            script_str = ': Array<' + valueType + '>';
            break;

        case '*':
            script_str = '?: Array<' + valueType + '>';
            break;

        default:
            script_str = ': ERROR_BAD_COUNT';
            break;
    }

    return script_str;
}

function GenerateArbitraryAssignmentBody(sme: Model): string {
    let assignment_body: string = '\n';
    let element_name = GetArbitraryElementName(sme);
    assignment_body +=
        'idShort: opt.' +
        element_name +
        '.idShort,\n' +
        'semanticId: opt.' +
        element_name +
        '.semanticId';

    switch (sme.modelType) {
        case 'Property':
            {
                assignment_body +=
                    ',\nvalueType: opt.' +
                    element_name +
                    '.valueType' +
                    ',\nvalue: ' +
                    'opt.' +
                    element_name +
                    '.value.toString()';
            }
            break;
        case 'MultiLanguageProperty':
            {
                assignment_body +=
                    ',\nvalue: ' + 'opt.' + element_name + '.value';
            }
            break;

        case 'ReferenceElement':
            {
                assignment_body +=
                    ',\nvalue: ' + 'opt.' + element_name + '.value';
            }
            break;

        case 'File':
            {
                assignment_body +=
                    ',\nvalue: ' +
                    'opt.' +
                    element_name +
                    '.value' +
                    ',\ncontentType: ' +
                    'opt.' +
                    element_name +
                    '.contentType';
            }
            break;

        case 'Entity':
            {
                assignment_body +=
                    ',\nstatements: ' +
                    'opt.' +
                    element_name +
                    '.statements' +
                    ',\nentityType: ' +
                    'opt.' +
                    element_name +
                    '.entityType' +
                    ',\nglobalAssetId: ' +
                    'opt.' +
                    element_name +
                    '.globalAssetId' +
                    ',\nspecificAssetIds: ' +
                    'opt.' +
                    element_name +
                    '.specificAssetIds';
            }
            break;

        case 'SubmodelElement':
            {
                assignment_body =
                    '({' + assignment_body.replace(/\n/g, '\n    ') + '\n});';
                return assignment_body;
            }
            break;
    }
    assignment_body =
        'new ' +
        sme.modelType +
        '({' +
        assignment_body.replace(/\n/g, '\n    ') +
        '\n});';
    return assignment_body;
}

function GenerateAssignmentBody(sme: Model, idShort: string): string {
    let assignment_body: string = '\n';
    assignment_body += "idShort: '" + idShort + "'";
    if (sme.semanticId) {
        assignment_body +=
            ',\nsemanticId: {\n' +
            '    type: "ModelReference",\n' +
            '    keys: [\n' +
            '              {\n' +
            '                  type: "ConceptDescription",\n' +
            '                  value: "' +
            sme.semanticId +
            '"\n' +
            '              }\n' +
            '    ]\n' +
            '}';
    }

    switch (sme.modelType) {
        case 'Property':
            {
                let m = sme as PropertyModel;
                assignment_body +=
                    ",\nvalueType: '" +
                    m.valueType +
                    "'" +
                    ',\nvalue: ' +
                    'opt.' +
                    (m.alias || idShort) +
                    '.toString()';
            }
            break;
        case 'MultiLanguageProperty':
            {
                let m = sme as MlpModel;
                assignment_body += ',\nvalue: ' + 'opt.' + (m.alias || idShort);
            }
            break;

        case 'ReferenceElement':
            {
                let m = sme as ReferenceElementModel;
                assignment_body += ',\nvalue: ' + 'opt.' + (m.alias || idShort);
            }
            break;

        case 'File':
            {
                let m = sme as FileModel;
                assignment_body +=
                    ',\nvalue: ' +
                    'opt.' +
                    (m.alias || idShort) +
                    '.value,' +
                    '\ncontentType: ' +
                    'opt.' +
                    (m.alias || idShort) +
                    '.contentType';
            }
            break;

        case 'Entity':
            {
                let m = sme as EntityModel;
                assignment_body +=
                    ',\nstatements: ' +
                    'opt.' +
                    (m.alias || idShort) +
                    '.statements,' +
                    '\nentityType: ' +
                    'opt.' +
                    (m.alias || idShort) +
                    '.entityType,' +
                    '\nglobalAssetId: ' +
                    'opt.' +
                    (m.alias || idShort) +
                    '.globalAssetId,' +
                    '\nspecificAssetIds: ' +
                    'opt.' +
                    (m.alias || idShort) +
                    '.specificAssetIds,';
            }
            break;

        case 'SubmodelElementCollection':
            {
                assignment_body = assignment_body.replace(
                    "idShort: '" + idShort + "'",
                    "idShort: '" + idShort + "'" + ' + postfix'
                );
                let m = sme as SmeModel;
                assignment_body += ',\nvalue: submodelElements';
            }
            break;

        case 'Submodel':
            {
                assignment_body = assignment_body.replace(
                    "idShort: '" + idShort + "'",
                    "idShort: '" + idShort + "'" + ' + postfix'
                );
                let m = sme as SmModel;
                assignment_body =
                    '\nid: id,' +
                    assignment_body +
                    ',\nsubmodelElements: submodelElements';
            }
            break;
    }
    assignment_body =
        'new ' +
        sme.modelType +
        '({' +
        assignment_body.replace(/\n/g, '\n    ') +
        '\n});';
    return assignment_body;
}

function GenerateFunction(
    model: Model,
    model_name: string
): {
    main_function: string;
    auxiliaries: Array<string>;
} {
    let main_function: string = '';
    let auxiliaries: Array<string> = [];
    let smes: { [prop: string]: Model } = {};
    let model_type_short = 'ERROR_BAD_MODEL_TYPE';
    let extra_parameters = '';
    let function_body: string = '';
    const function_name: string =
        'Generate_' + model_type_short + '_' + model_name;
    if (generated_functions[function_name]) {
        return { main_function: '', auxiliaries: [] };
    }
    generated_functions[function_name] = true;
    switch (model.modelType) {
        case 'Submodel':
            {
                main_function += 'export ';
                model_type_short = 'SM';
                let m = model as SmModel;
                smes = m.submodelElements;
                extra_parameters = 'id: string,\n';
            }
            break;
        case 'SubmodelElementCollection':
            {
                model_type_short = 'SMC';
                let m = model as SmeModel;
                smes = m.value;
            }
            break;
        default:
            console.error(
                'PREPROCESSOR ERROR: Unintended path. generator function can only be generated for Submodels and SMCs. ',
                +model_name + ' is neither!'
            );
            break;
    }
    extra_parameters += 'idShort_postfix?: string';
    function_body += "const postfix = idShort_postfix || '';\n";
    let smcs = Object.keys(smes)
        .filter((key: string) => {
            return (
                smes[key as keyof Model].modelType ===
                'SubmodelElementCollection'
            );
        })
        .map((key: string) => {
            return GenerateFunction(smes[key], key);
        });
    smcs.forEach(
        (item: { main_function: string; auxiliaries: Array<string> }) => {
            auxiliaries = auxiliaries.concat(item.auxiliaries);
        }
    );
    smcs.forEach(
        (item: { main_function: string; auxiliaries: Array<string> }) => {
            auxiliaries.push(item.main_function);
        }
    );
    let non_smcs = Object.keys(smes).filter((key: string) => {
        return (
            smes[key as keyof Model].modelType !== 'SubmodelElementCollection'
        );
    }); // remove this! unless used

    main_function +=
        'function Generate_' +
        model_type_short +
        '_' +
        model_name +
        '(opt' +
        GetOptProps(model, '!') +
        ', ' +
        extra_parameters +
        ' ): ' +
        model.modelType +
        ' {\n';
    function_body += 'const submodelElements: Array<SubmodelElement> = [];\n';
    Object.keys(smes).forEach((key: string) => {
        let sme = smes[key];
        let assignment: string = '';
        if (key === '{arbitrary}') {
            let arbitrary_element_name = GetArbitraryElementName(sme);
            if (sme.modelType == 'SubmodelElement') {
                let assignment_body: string =
                    '\nidShort: opt.' + arbitrary_element_name + '.idShort';
                assignment_body +=
                    ',\nsemanticId: opt.' +
                    arbitrary_element_name +
                    '.semanticId';
                let property_assignment_body =
                    assignment_body +
                    ',\nvalueType: opt.' +
                    arbitrary_element_name +
                    '.value.valueType' +
                    ',\nvalue: opt.' +
                    arbitrary_element_name +
                    '.value.value';
                let mlp_assignment_body =
                    assignment_body +
                    ',\nvalue: opt.' +
                    arbitrary_element_name +
                    '.value.value';
                let reference_element_assignment_body =
                    assignment_body +
                    ',\nvalue: opt.' +
                    arbitrary_element_name +
                    '.value.value';
                let file_assignment_body =
                    assignment_body +
                    ',\nvalue: opt.' +
                    arbitrary_element_name +
                    '.value.value' +
                    ',\ncontentType: opt.' +
                    arbitrary_element_name +
                    '.value.contentType';
                let entity_assignment_body =
                    assignment_body +
                    ',\nstatements: opt.' +
                    arbitrary_element_name +
                    '.value.statements' +
                    ',\nentityType: opt.' +
                    arbitrary_element_name +
                    '.value.entityType' +
                    ',\nglobalAssetId: opt.' +
                    arbitrary_element_name +
                    '.value.globalAssetId' +
                    ',\nspecificAssetIds: opt.' +
                    arbitrary_element_name +
                    '.value.spicificAssetIds';
                let case_property =
                    '\nconst element = new Property({' +
                    property_assignment_body.replace(/\n/g, '\n    ') +
                    '\n})';
                let case_mlp =
                    '\nconst element = new MultiLanguageProperty({' +
                    mlp_assignment_body.replace(/\n/g, '\n    ') +
                    '\n})';
                let case_reference_element =
                    '\nconst element = new ReferenceElement({' +
                    reference_element_assignment_body.replace(/\n/g, '\n    ') +
                    '\n})';
                let case_file =
                    '\nconst element = new File({' +
                    file_assignment_body.replace(/\n/g, '\n    ') +
                    '\n})';
                let case_entity =
                    '\nconst element = new Entity({' +
                    entity_assignment_body.replace(/\n/g, '\n    ') +
                    '\n})';
                const switchCases: string =
                    '\ncase "Property":\n{' +
                    case_property.replace(/\n/g, '\n    ') +
                    '\nsubmodelElements.push(element)' +
                    '\n}\nbreak;\n' +
                    '\ncase "MultiLanguageProperty":\n{' +
                    case_mlp.replace(/\n/g, '\n    ') +
                    '\nsubmodelElements.push(element)' +
                    '\n}\nbreak;\n' +
                    '\ncase "ReferenceElement":\n{' +
                    case_reference_element.replace(/\n/g, '\n    ') +
                    '\nsubmodelElements.push(element)' +
                    '\n}\nbreak;\n' +
                    '\ncase "File":\n{' +
                    case_file.replace(/\n/g, '\n    ') +
                    '\nsubmodelElements.push(element)' +
                    '\n}\nbreak;\n' +
                    '\ncase "Entity":\n{' +
                    case_entity.replace(/\n/g, '\n    ') +
                    '\nsubmodelElements.push(element)' +
                    '\n}\nbreak;\n';
                assignment +=
                    'switch(opt.' +
                    arbitrary_element_name +
                    '.modelType){' +
                    switchCases.replace(/\n/g, '\n    ') +
                    '\n}\n';
            } else {
                assignment += 'const element = ';
                assignment += GenerateArbitraryAssignmentBody(sme) + '\n';
                assignment += 'submodelElements.push(element)';
            }
            if (sme.count === '+' || sme.count === '*') {
                assignment = assignment.replace(
                    new RegExp('opt.' + arbitrary_element_name + '.', 'g'),
                    'item.'
                );
                assignment =
                    'opt.' +
                    arbitrary_element_name +
                    '.forEach((item) => {\n    ' +
                    assignment.replace(/\n/g, '\n    ') +
                    '\n});';
            }
            if (sme.count === '*' || sme.count === '?') {
                assignment =
                    'if (opt.' +
                    arbitrary_element_name +
                    ') {\n    ' +
                    assignment.replace(/\n/g, '\n    ') +
                    '\n}';
            }
        } else {
            assignment += 'const ' + (sme.alias || key) + ' = ';
            if (sme.modelType === 'SubmodelElementCollection') {
                assignment +=
                    'Generate_SMC_' +
                    key +
                    '(opt.' +
                    (sme.alias || key) +
                    ')\n';
            } else {
                assignment += GenerateAssignmentBody(sme, key) + '\n';
            }
            assignment += 'submodelElements.push(' + (sme.alias || key) + ')';
            if (sme.count === '+' || sme.count === '*') {
                assignment = assignment.replace(
                    new RegExp('opt.' + (sme.alias || key), 'g'),
                    'item'
                );
                assignment = assignment.replace(
                    "idShort: '" + key + "'",
                    "idShort: '" + key + "' + i.toString().padStart(3, '0') "
                );
                assignment =
                    'opt.' +
                    (sme.alias || key) +
                    '.forEach((item, i) => {\n    ' +
                    assignment.replace(/\n/g, '\n    ') +
                    '\n});';
            }
            if (sme.count === '*' || sme.count === '?') {
                assignment =
                    'if (opt.' +
                    (sme.alias || key) +
                    ') {\n    ' +
                    assignment.replace(/\n/g, '\n    ') +
                    '\n}';
            }
        }
        function_body += assignment + '\n';
    });
    function_body +=
        'const result = ' +
        GenerateAssignmentBody(model, model_name) +
        '\nreturn result';
    main_function += '    ' + function_body.replace(/\n/g, '\n    ') + '\n}';
    return { main_function, auxiliaries };
}

function CreateGenerator(json_submodel: { [key: string]: Model }): void {
    Object.keys(json_submodel).forEach((item: string) => {
        const model = json_submodel[item];
        const model_name = model.alias || item;
        let imports: string =
            "import { Reference, SpecificAssetId, Submodel } from '../aas_components';\n" +
            "import { ContentType, DataTypeDefXsd, LangStringSet, PathType, ValueDataType, EntityType, Identifier, AasSubmodelElements } from '../primitive_data_types';\n" +
            "import { SubmodelElementCollection, Property, MultiLanguageProperty, ReferenceElement, File, Entity } from '../submodel_elements';\n" +
            "import { xs } from '../xs_data_types';\n" +
            "import { SubmodelElement } from '../aas_components';\n" +
            "import { GetSemanticId } from '../../services/oi4_helpers';";
        let script_str: string = '';
        let functions = GenerateFunction(model, model_name);
        script_str +=
            imports +
            '\n\n' +
            functions.auxiliaries.join('\n') +
            '\n' +
            functions.main_function;
        const file_path =
            '../../oi4_definitions/submodels/' +
            item
                .split(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g)
                .join('_')
                .toLowerCase() +
            '_sm.ts';
        try {
            fs.unlinkSync(path.join(__dirname, file_path));
        } catch (error) {}
        fs.writeFileSync(path.join(__dirname, file_path), script_str);
        generated_functions = {};
    });
}

export default {
    CreateGenerator
};

import { AasReferables } from '../oi4_definitions/primitive_data_types';
import fs from 'fs';
import path from 'path';

//Simplified submodel definition files. To create a new submodel simply
//  add JSON file to ./submodels/ and import its content below, then call
//  the CreateGenerator() function on it at the end of this script
import nameplate from './submodels/nameplate.json';
import contact_information from './submodels/contact_information.json';
import handover_documentation from './submodels/handover_documentation.json';

//TODO: Optimise imports in CreateGenerator()

/////////////////////
//CountTypes:      //
//-----------------//
//  ! = 1          //
//  ? = [0-1]      //
//  + = [1-*]      //
//  * = [0-*]      //
/////////////////////
type CountType = '!' | '?' | '+' | '*';
type Model =
    | {
          alias?: string;
          modelType: 'Submodel';
          count: CountType;
          submodelElements: { [prop: string]: Model };
      }
    | {
          alias?: string;
          modelType: 'SubmodelElementCollection';
          count: CountType;
          value: { [prop: string]: Model };
      }
    | {
          alias?: string;
          modelType: 'Property';
          count: CountType;
          valueType: string;
      }
    | {
          alias?: string;
          modelType: AasReferables;
          count: CountType;
      }
    | {
          alias: string;
          modelType: AasReferables;
          count: CountType;
          [prop: string]: string;
      }
    | {
          modelType: AasReferables;
          count: CountType;
          [prop: string]: string;
      };

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
    }
    if (model.count === '*' || model.count === '+') {
        suffix = suffix.replace(/s$/, 'se').replace(/y$/, 'ie') + 's';
    }
    return element_key + suffix;
}

function ExpandArbitraryElement(model: Model): string {
    let element_body = 'idShort: string';
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
                let m = opt as {
                    alias?: string;
                    modelType: 'Submodel';
                    submodelElements: { [prop: string]: Model };
                };
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
                let m = opt as {
                    alias?: string;
                    modelType: 'SubmodelElementCollection';
                    value: { [prop: string]: Model };
                };
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
            let m = opt as {
                alias?: string;
                modelType: 'Property';
                count: string;
                valueType: string;
            };
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
                '    globalAssetId?: Reference,\n' +
                '    specificAssetId?: SpecificAssetId\n' +
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
        'semanticId: GetSemanticId(opt.' +
        element_name +
        '.idShort)';

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
                    '.value';
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
                    '.value,' +
                    '\ncontentType: ' +
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
                    '.statements,' +
                    '\nentityType: ' +
                    'opt.' +
                    element_name +
                    '.entityType,' +
                    '\nglobalAssetId: ' +
                    'opt.' +
                    element_name +
                    '.globalAssetId,' +
                    '\nspecificAssetId: ' +
                    'opt.' +
                    element_name +
                    '.specificAssetId,';
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
    assignment_body +=
        "idShort: '" +
        idShort +
        "'" +
        ',\n' +
        "semanticId: GetSemanticId('" +
        idShort +
        "')";

    switch (sme.modelType) {
        case 'Property':
            {
                let m = sme as {
                    alias?: string;
                    modelType: 'Property';
                    count: CountType;
                    valueType: string;
                };
                assignment_body +=
                    ",\nvalueType: '" +
                    m.valueType +
                    "'" +
                    ',\nvalue: ' +
                    'opt.' +
                    (m.alias || idShort);
            }
            break;
        case 'MultiLanguageProperty':
            {
                let m = sme as {
                    alias?: string;
                    modelType: 'MultiLanguageProperty';
                    count: CountType;
                };
                assignment_body += ',\nvalue: ' + 'opt.' + (m.alias || idShort);
            }
            break;

        case 'ReferenceElement':
            {
                let m = sme as {
                    alias?: string;
                    modelType: 'ReferenceElement';
                    count: CountType;
                };
                assignment_body += ',\nvalue: ' + 'opt.' + (m.alias || idShort);
            }
            break;

        case 'File':
            {
                let m = sme as {
                    alias?: string;
                    modelType: 'File';
                    count: CountType;
                };
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
                let m = sme as {
                    alias?: string;
                    modelType: 'Entity';
                    count: CountType;
                };
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
                    '\nspecificAssetId: ' +
                    'opt.' +
                    (m.alias || idShort) +
                    '.specificAssetId,';
            }
            break;

        case 'SubmodelElementCollection':
            {
                assignment_body = assignment_body.replace(
                    "idShort: '" + idShort + "'" + ',\n',
                    "idShort: '" + idShort + "'" + ' + postfix,\n'
                );
                let m = sme as {
                    alias?: string;
                    modelType: 'SubmodelElementCollection';
                    count: CountType;
                };
                assignment_body += ',\nvalue: submodelElements';
            }
            break;

        case 'Submodel':
            {
                assignment_body = assignment_body.replace(
                    "idShort: '" + idShort + "'" + ',\n',
                    "idShort: '" + idShort + "'" + ' + postfix,\n'
                );
                let m = sme as {
                    modelType: 'Submodel';
                    count: CountType;
                };
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
    switch (model.modelType) {
        case 'Submodel':
            {
                main_function += 'export ';
                model_type_short = 'SM';
                let m = model as {
                    modelType: 'Submodel';
                    count: string;
                    submodelElements: { [prop: string]: Model };
                };
                smes = m.submodelElements;
                extra_parameters = 'id: string,\n';
            }
            break;
        case 'SubmodelElementCollection':
            {
                model_type_short = 'SMC';
                let m = model as {
                    modelType: 'SubmodelElementCollection';
                    count: string;
                    value: { [prop: string]: Model };
                };
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
    function_body += "let postfix = idShort_postfix || '';\n";
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
    function_body += 'let submodelElements: Array<SubmodelElement> = [];\n';
    Object.keys(smes).forEach((key: string) => {
        let sme = smes[key];
        let assignment: string = '';
        if (key === '{arbitrary}') {
            let arbitrary_element_name = GetArbitraryElementName(sme);
            assignment = GenerateArbitraryAssignmentBody(sme);
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
                    (sme.alias || key) +
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
                    "idShort: '" +
                        key +
                        "{' + number_to_padded_string(i, 3) + '}'"
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
            "import { ContentType, DataTypeDefXsd, LangStringSet, PathType, ValueDataType, EntityType } from '../primitive_data_types';\n" +
            "import { SubmodelElementCollection, Property, MultiLanguageProperty, ReferenceElement, File, Entity } from '../submodel_elements';\n" +
            "import { xs } from '../xs_data_types';\n" +
            "import { SubmodelElement } from '../aas_components';\n" +
            "import { GetSemanticId } from '../../services/oi4_helpers';" +
            "import { number_to_padded_string } from '../../services/oi4_helpers';";
        let script_str: string = '';
        let functions = GenerateFunction(model, model_name);
        script_str +=
            imports +
            '\n\n' +
            functions.auxiliaries.join('\n') +
            '\n' +
            functions.main_function;
        const file_path =
            '../oi4_definitions/submodels/' +
            item
                .split(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g)
                .join('_')
                .toLowerCase() +
            '_sm.ts';
        try {
            fs.unlinkSync(path.join(__dirname, file_path));
        } catch (error) {}
        fs.writeFileSync(path.join(__dirname, file_path), script_str);
    });
}

CreateGenerator(nameplate as { [key: string]: Model });
CreateGenerator(contact_information as { [key: string]: Model });
CreateGenerator(handover_documentation as { [key: string]: Model });

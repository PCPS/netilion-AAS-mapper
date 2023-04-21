import { error } from 'winston';
import { AasReferables } from '../oi4_definitions/primitive_data_types';
import nameplate_json from './submodels/nameplate.json';
import fs from 'fs';
import path from 'path';

type CountType = '!' | '?' | '+' | '*';
type Model =
    | {
          modelType: 'Submodel';
          count: CountType;
          submodelElements: { [prop: string]: Model };
      }
    | {
          modelType: 'SubmodelElementCollection';
          count: CountType;
          value: { [prop: string]: Model };
      }
    | {
          modelType: 'Property';
          count: CountType;
          valueType: string;
      }
    | {
          modelType: AasReferables;
          count: CountType;
      }
    | {
          modelType: AasReferables;
          count: CountType;
          [prop: string]: string;
      };

const nameplate = nameplate_json.Namplate as Model;

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
                            a + '\n' + b + GetOptProps(m.submodelElements[b])
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
                    modelType: 'SubmodelElementCollection';
                    value: { [prop: string]: Model };
                };
                valueType = Object.keys(m.value).reduce((a, b) => {
                    if (b === '{arbitrary}') {
                        return a + '\n' + ExpandArbitraryElement(m.value[b]);
                    } else {
                        return a + '\n' + b + GetOptProps(m.value[b]);
                    }
                }, '');
            }
            valueType = valueType.replace(/\n/g, '\n    ');
            valueType = '{' + valueType + '\n}';
            break;

        case 'Property':
            let m = opt as {
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
                    idShort;
            }
            break;
        case 'MultiLanguageProperty':
            {
                let m = sme as {
                    modelType: 'MultiLanguageProperty';
                    count: CountType;
                };
                assignment_body += ',\nvalue: ' + 'opt.' + idShort;
            }
            break;

        case 'ReferenceElement':
            {
                let m = sme as {
                    modelType: 'ReferenceElement';
                    count: CountType;
                };
                assignment_body += ',\nvalue: ' + 'opt.' + idShort;
            }
            break;

        case 'File':
            {
                let m = sme as {
                    modelType: 'File';
                    count: CountType;
                };
                assignment_body +=
                    ',\nvalue: ' +
                    'opt.' +
                    idShort +
                    '.value,' +
                    '\ncontentType: ' +
                    'opt.' +
                    idShort +
                    '.contentType';
            }
            break;

        case 'SubmodelElementCollection':
            {
                assignment_body = assignment_body.replace(
                    "idShort: '" + idShort + "'" + ',\n',
                    "idShort: '" + idShort + "'" + ' + postfix,\n'
                );
                let m = sme as {
                    modelType: 'SubmodelElementCollection';
                    count: CountType;
                };
                assignment_body += ',\nvalue: submodelElements';
            }
            break;

        case 'Submodel':
            {
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
                extra_parameters = 'id: string';
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
                extra_parameters = 'idShort_postfix?: string';
                function_body += "let postfix = idShort_postfix || '';\n";
            }
            break;
        default:
            console.error(
                'PREPROCESSOR ERROR: Unintended path. generator function can only be generated for Submodels and SMCs. ',
                +model_name + ' is neither!'
            );
            break;
    }
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
                    key +
                    ') {\n    ' +
                    assignment.replace(/\n/g, '\n    ') +
                    '\n}';
            }
        } else {
            assignment += 'const ' + key + ' = ';
            if (sme.modelType === 'SubmodelElementCollection') {
                assignment += 'Generate_SMC_' + key + '(opt.' + key + ')\n';
            } else {
                assignment += GenerateAssignmentBody(sme, key) + '\n';
            }
            assignment += 'submodelElements.push(' + key + ')';
            if (sme.count === '+' || sme.count === '*') {
                assignment = assignment.replace('opt.' + key, 'item');
                assignment = assignment.replace(
                    "idShort: '" + key + "'",
                    "idShort: '" +
                        key +
                        "{' + number_to_padded_string(i, 3) + '}'"
                );
                assignment =
                    'opt.' +
                    key +
                    '.forEach((item, i) => {\n    ' +
                    assignment.replace(/\n/g, '\n    ') +
                    '\n});';
            }
            if (sme.count === '*' || sme.count === '?') {
                assignment =
                    'if (opt.' +
                    key +
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

function CreateGenerator(model: Model, model_name: string): string {
    let imports: string =
        "import { Reference, Submodel } from '../aas_components';\n" +
        "import { ContentType, DataTypeDefXsd, LangStringSet, PathType, ValueDataType } from '../primitive_data_types';\n" +
        "import { SubmodelElementCollection, Property, MultiLanguageProperty, ReferenceElement, File, } from '../submodel_elements';\n" +
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

    return script_str;
}

let src: string = CreateGenerator(nameplate, 'Nameplate');
fs.unlinkSync(
    path.join(__dirname, '../oi4_definitions/submodels/nameplate_sm.ts')
);
fs.writeFileSync(
    path.join(__dirname, '../oi4_definitions/submodels/nameplate_sm.ts'),
    src
);

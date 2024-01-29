import fs from 'fs';
import path from 'path';

import { Map_Descriptor } from '../Interfaces/map_descriptor';

function indent(input_string: string): string {
    return input_string.replace(/\n/g, '\n    ');
}

function write_agents(map: Map_Descriptor) {
    map.clients.forEach((client) => {
        const imports_string: string =
            "if (process.env.NODE_ENV !== 'production') {\n" +
            "    const dotenv = require('dotenv');\n" +
            '    // Use dev dependency\n' +
            '    dotenv.config();\n' +
            '}' +
            client.imports.reduce((result, item) => {
                if (!item.import_all) {
                    const item_imports =
                        '{' + item.imported_names.join(', ') + '}';
                    return (
                        result +
                        '\n' +
                        'import ' +
                        item_imports +
                        ' from "../' +
                        item.path +
                        '"'
                    );
                } else {
                    return (
                        result +
                        '\n' +
                        'import * as ' +
                        item.name +
                        ' from "../' +
                        item.path +
                        '"'
                    );
                }
            }, '');

        const script_str: string = imports_string;

        const file_path: string = '../../agents/' + client.name + '_agent.ts';
        try {
            fs.unlinkSync(path.join(__dirname, file_path));
        } catch (error) {}
        fs.writeFileSync(path.join(__dirname, file_path), script_str);
    });
}

export default {
    write_agents
};

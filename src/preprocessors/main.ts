import semantic_id_collector from './operations/semantic_id_collector';
import submodel_function_generator from './operations/submodel_function_generator';

// Simplified submodel definition files. To create a new submodel simply
// add JSON file to ./submodels/ and import its content below, then call
// the CreateGenerator() function on it at the end of this script
import { Model } from './Interfaces/simplified';
import nameplate from './submodels/nameplate.json';
import technical_data from './submodels/technical_data.json';
import contact_information from './submodels/contact_information.json';
import handover_documentation from './submodels/handover_documentation.json';
import configuration_as_built from './submodels/as_built.json';
import configuration_as_documented from './submodels/as_documented.json';

// Map descriptor file for generating agents and mapper.
import map_descriptor from './Map/Map.json';
import { Map_Descriptor } from './Interfaces/map_descriptor';

// Generate ECLASS.json from XML. This only needs to be done once and can be slow depending on the ECLASS dictionary size.
// semantic_id_collector.GenerateEclassFromXml()
semantic_id_collector.GenerateDescriptionsFromEclass();

// To add generators for a submodel, define the submodel using the simplified json format and import it. then, use the following scheme to call 'CreateGenerator' on the submodel.
submodel_function_generator.CreateGenerator(
    nameplate as { [key: string]: Model }
);
submodel_function_generator.CreateGenerator(
    technical_data as { [key: string]: Model }
);
submodel_function_generator.CreateGenerator(
    contact_information as { [key: string]: Model }
);
submodel_function_generator.CreateGenerator(
    handover_documentation as { [key: string]: Model }
);
submodel_function_generator.CreateGenerator(
    configuration_as_built as { [key: string]: Model }
);
submodel_function_generator.CreateGenerator(
    configuration_as_documented as { [key: string]: Model }
);

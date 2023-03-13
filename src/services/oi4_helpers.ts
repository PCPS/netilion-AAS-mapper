import { Reference } from '../oi4_definitions/aas_components';
import { Key } from '../oi4_definitions/primitive_data_types';

export function GenerateChildSemanticId(opt?: {
    parent?: Reference;
    keys: Array<Key>;
}): Reference | undefined {
    if (opt && opt.parent) {
        return {
            type: opt.parent.type,
            keys: [...opt.parent.keys, ...opt.keys]
        };
    } else return;
}

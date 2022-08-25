import { readFile } from 'fs/promises';

import { FlattenedHelpDescriptor } from '../interfaces';
import parseHelpDescriptor from '../service/parse-help-descriptor';

export default async function (path: string): Promise<FlattenedHelpDescriptor> {
    const content = await readFile(path, 'utf8');
    let data: FlattenedHelpDescriptor;

    try {
        const _data = JSON.parse(content);
        data = parseHelpDescriptor(_data);
    } catch (err) {
        throw new Error(
            'Invalid help descriptor file: ' + (err as Error).message
        );
    }

    return data;
}

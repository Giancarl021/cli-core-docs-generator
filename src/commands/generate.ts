import { existsSync as fileExists } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import locate from '@giancarl021/locate';
import { Command, HelpDescriptor } from '@giancarl021/cli-core/interfaces';
import parseHelpDescriptor from '../service/parse-help-descriptor';

const command: Command = async function (args) {
    const [file] = args;
    const path = locate(file);

    if (!fileExists(path)) throw new Error('Help descriptor file not found');
    const content = await readFile(path, 'utf8');
    let data: HelpDescriptor;

    try {
        const _data = JSON.parse(content);
        data = parseHelpDescriptor(_data);
    } catch {
        throw new Error('Invalid help descriptor file');
    }

    return '';
};

export default command;

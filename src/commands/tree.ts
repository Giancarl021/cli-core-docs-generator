import { existsSync as exists } from 'fs';
import locate from '@giancarl021/locate';
import { Command } from '@giancarl021/cli-core/interfaces';
import readHelpDescriptor from '../util/read-help-descriptor';
import generateCommandTree from '../service/generate-command-tree';
import { generateAsciiTree } from '../util/generate-ascii-tree';

const command: Command = async function (args) {
    const [file] = args;
    const path = locate(file, true);

    const appName = this.helpers.valueOrDefault(
        this.helpers.getFlag('app-name', 'n'),
        '@giancarl021/cli-core app'
    );

    const asJson = this.helpers.hasFlag('json', 'j');
    const includeDescription = this.helpers.hasFlag('description', 'd');

    if (!appName) throw new Error('Missing app name');
    if (!exists(path)) throw new Error('Help descriptor file not found');

    const data = await readHelpDescriptor(path);
    const tree = generateCommandTree(appName, data);

    const result = asJson
        ? JSON.stringify(tree, null, 2)
        : generateAsciiTree(tree, includeDescription);

    return result;
};

export default command;

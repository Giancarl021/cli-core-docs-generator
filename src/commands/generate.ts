import { dirname, join } from 'path';
import { existsSync as exists } from 'fs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import locate from '@giancarl021/locate';
import { Command } from '@giancarl021/cli-core/interfaces';
import { FlattenedHelpDescriptor } from '../interfaces';

import parseHelpDescriptor from '../service/parse-help-descriptor';
import convertToMarkdown from '../service/convert-to-markdown';
import constants from '../util/constants';

const command: Command = async function (args) {
    const [appName, file] = args;
    const path = locate(file, true);

    if (!appName) throw new Error('Missing app name');
    if (!exists(path)) throw new Error('Help descriptor file not found');

    const outputDir = locate(
        this.helpers.valueOrDefault(
            this.helpers.getFlag('output-directory', 'output-dir', 'o'),
            constants.outputDir.main
        ),
        true
    );

    const auxiliaryDir = locate(
        this.helpers.valueOrDefault(
            this.helpers.getFlag('auxiliary-directory', 'auxiliary-dir', 'a'),
            join(outputDir, constants.outputDir.auxiliary)
        ),
        true
    );

    const depthString = this.helpers.valueOrDefault(
        this.helpers.getFlag('depth', 'd'),
        constants.depth.default
    );
    let depth: number | null;

    if (isNaN(Number(depthString))) depth = null;
    else depth = Number(depthString);

    if (constants.depth.maximum && depth && depth > constants.depth.maximum)
        throw new Error(`Depth must be less than ${constants.depth.maximum}`);
    if (depth && depth < constants.depth.minimum)
        throw new Error(
            `Depth must be greater then ${constants.depth.minimum}`
        );

    const flagPrefix = this.helpers.valueOrDefault(
        this.helpers.getFlag('flag-prefix'),
        constants.flags.defaultFlagPrefix
    );

    const singleCharacterFlagPrefix = this.helpers.valueOrDefault(
        this.helpers.getFlag('single-character-flag-prefix'),
        constants.flags.defaultSingleCharacterFlagPrefix
    );

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

    const files = await convertToMarkdown({
        appName,
        descriptor: data,
        outputDir,
        auxiliaryDir,
        flagPrefix,
        singleCharacterFlagPrefix,
        depth
    });

    for (const file of files) {
        const dir = dirname(file.path);
        if (!exists(dir)) await mkdir(dir, { recursive: true });
        await writeFile(file.path, file.content);
    }

    return `Wrote documentation files on "${outputDir}"`;
};

export default command;

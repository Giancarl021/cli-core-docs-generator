import { dirname, join } from 'path';
import { existsSync as exists } from 'fs';
import { writeFile, mkdir, rm } from 'fs/promises';
import locate from '@giancarl021/locate';
import { Command } from '@giancarl021/cli-core/interfaces';

import convertToMarkdown from '../service/convert-to-markdown';
import constants from '../util/constants';
import readHelpDescriptor from '../util/read-help-descriptor';

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

    const flat = this.helpers.hasFlag('flat');
    const force = this.helpers.hasFlag('force', 'f');

    const flagPrefix = this.helpers.valueOrDefault(
        this.helpers.getFlag('flag-prefix'),
        constants.flags.defaultFlagPrefix
    );

    const singleCharacterFlagPrefix = this.helpers.valueOrDefault(
        this.helpers.getFlag('single-character-flag-prefix'),
        constants.flags.defaultSingleCharacterFlagPrefix
    );

    if (exists(auxiliaryDir)) {
        if (force) await rm(auxiliaryDir, { recursive: true });
        else
            throw new Error(
                `${constants.outputDir.auxiliary} directory already exists. Use --force to overwrite.`
            );
    }

    const data = await readHelpDescriptor(path);

    const files = await convertToMarkdown({
        appName,
        descriptor: data,
        outputDir,
        auxiliaryDir,
        flagPrefix,
        singleCharacterFlagPrefix,
        flat,
        overwrite: force
    });

    for (const file of files) {
        const dir = dirname(file.path);
        if (!exists(dir)) await mkdir(dir, { recursive: true });
        await writeFile(file.path, file.content);
    }

    return `Wrote documentation files on "${outputDir}"`;
};

export default command;

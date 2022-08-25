import { existsSync as exists } from 'fs';
import {
    DocFile,
    ConverterOptions,
    ConverterRecursionContext
} from '../interfaces';

import { convertCommand, convertMainFile } from '../util/converter-utils';

import constants from '../util/constants';

export default async function (options: ConverterOptions): Promise<DocFile[]> {
    const context: ConverterRecursionContext = {
        constants: {
            appName: options.appName,
            isFlat: options.flat,
            outputDir: {
                main: options.outputDir,
                auxiliary: options.auxiliaryDir
            },
            flags: {
                flagPrefix: options.flagPrefix,
                singleCharacterFlagPrefix: options.singleCharacterFlagPrefix
            }
        },
        common: {
            files: []
        },
        variables: {
            depth: 0,
            commandChain: [options.appName]
        }
    };

    const mainFile = await convertMainFile(context, options.descriptor);

    context.common.files.push(mainFile);

    if (!options.flat) {
        context.variables.depth++;
        for (const commandName in options.descriptor) {
            const command = options.descriptor[commandName];
            convertCommand(commandName, command, context);
        }
    }

    return context.common.files;
}

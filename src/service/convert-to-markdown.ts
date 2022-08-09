import {
    DocFile,
    ConverterOptions,
    ConverterRecursionContext
} from '../interfaces';
import { convertCommand, convertMainFile } from '../util/converter-utils';

export default async function (options: ConverterOptions): Promise<DocFile[]> {
    const context: ConverterRecursionContext = {
        constants: {
            appName: options.appName,
            maxDepth: options.depth,
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

    context.common.files.push(
        await convertMainFile(context, options.descriptor)
    );

    if (options.depth && options.depth > 0) {
        context.variables.depth++;
        for (const commandName in options.descriptor) {
            const command = options.descriptor[commandName];
            convertCommand(commandName, command, context);
        }
    }

    return context.common.files;
}

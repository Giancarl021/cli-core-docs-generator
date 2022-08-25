import { ArgDescriptor } from '@giancarl021/cli-core/interfaces';
import { existsSync as exists } from 'fs';
import { readFile } from 'fs/promises';
import locate from '@giancarl021/locate';
import {
    ConverterRecursionContext,
    DocFile,
    FlattenedCommandDescriptor,
    FlattenedFlagsDescriptor,
    FlattenedHelpDescriptor,
    FlattenedParentCommandDescriptor
} from '../interfaces';

function deepen(
    context: ConverterRecursionContext,
    commandName: string
): ConverterRecursionContext {
    const result = {
        ...context,
        variables: {
            depth: context.variables.depth + 1,
            commandChain: [...context.variables.commandChain, commandName]
        }
    };

    return result;
}

function mapArg(arg: ArgDescriptor) {
    let result = arg.multiple
        ? `<${arg.name}1>, <${arg.name}2>, ...<${arg.name}N>`
        : `<${arg.name}>`;
    return arg.optional ? `[${result}]` : result;
}

function mapFlags(
    flags: FlattenedFlagsDescriptor,
    flagPrefixes: ConverterRecursionContext['constants']['flags']
) {
    const results: string[] = [];
    for (const flagName in flags) {
        const flag = flags[flagName];
        results.push(
            `* \`${getPrefix(flagName) + flagName}\`${
                flag.aliases && flag.aliases.length
                    ? ` | ${flag.aliases
                          .map((alias) => `\`${getPrefix(alias) + alias}\``)
                          .join(' | ')}`
                    : ''
            }: ${flag.description}${
                flag.values && flag.values.length
                    ? `. Value${
                          flag.values.length > 1 ? 's' : ''
                      }: ${flag.values.map((f) => `\`${f}\``).join(' | ')}`
                    : ''
            }`
        );
    }

    return results.length ? `## Flags\n\n${results.join(';\n')}.` : '';

    function getPrefix(flagName: string) {
        return flagName.length > 1
            ? flagPrefixes.flagPrefix
            : flagPrefixes.singleCharacterFlagPrefix;
    }
}

function createCommandMarkdownContent(
    commandName: string,
    command: FlattenedCommandDescriptor,
    context: ConverterRecursionContext
) {
    const chain = context.variables.commandChain.slice(1).join(' ');
    const commandChain = chain.length ? chain + ' ' + commandName : commandName;
    return `# ${commandChain}

${command.description}

## Usage

\`\`\`bash
${context.constants.appName} ${commandChain}${
        command.args.length ? ' ' + command.args.map(mapArg).join(' ') : ''
    }${Object.keys(command.flags).length ? ' <flags>' : ''}
\`\`\`

${mapFlags(command.flags, context.constants.flags)}

`;
}

function createParentCommandMarkdownContent(
    commandName: string,
    command: FlattenedParentCommandDescriptor,
    context: ConverterRecursionContext
) {
    console.log(context.variables.depth, commandName);
    return `# ${commandName}${
        command.description ? `\n\n${command.description}` : ''
    }

${
    context.constants.maxDepth === null ||
    context.variables.depth <= context.constants.maxDepth
        ? `## Subcommands

${createRefs(deepen(context, commandName), command.subcommands)}`
        : ''
}
`;
}

function createRefs(
    context: ConverterRecursionContext,
    descriptor: FlattenedHelpDescriptor
): string {
    const items: string[] = [];
    for (const commandName in descriptor) {
        const relativePath = `${
            context.variables.depth === 0
                ? context.constants.outputDir.auxiliary.split(/\\|\//g).pop() +
                  '/'
                : ''
        }${context.variables.commandChain.join('-')}-${commandName}.md`;
        const command = descriptor[commandName];
        items.push(
            `* [${commandName}](${relativePath}): ${command.description}`
        );
    }

    return items.length ? `${items.join(';\n')}.` : '';
}

export function convertCommand(
    commandName: string,
    command: FlattenedParentCommandDescriptor | FlattenedCommandDescriptor,
    context: ConverterRecursionContext
) {
    const currentFile = {
        path:
            (context.variables.depth > 0
                ? context.constants.outputDir.auxiliary
                : context.constants.outputDir.main) +
            '/' +
            createFilePath(commandName),
        depth: context.variables.depth
    } as DocFile;

    if (command.isParent) {
        currentFile.content = createParentCommandMarkdownContent(
            commandName,
            command,
            context
        );
        context.common.files.push(currentFile);

        for (const subcommandName in command.subcommands) {
            const subcommand = command.subcommands[subcommandName];
            convertCommand(
                subcommandName,
                subcommand,
                deepen(context, commandName)
            );
        }

        return;
    }

    currentFile.content = createCommandMarkdownContent(
        commandName,
        command,
        context
    );

    context.common.files.push(currentFile);

    function createFilePath(commandName: string) {
        return (
            [...context.variables.commandChain, commandName].join('-') + '.md'
        );
    }
}

export async function convertMainFile(
    context: ConverterRecursionContext,
    descriptor: FlattenedHelpDescriptor
): Promise<DocFile> {
    const path = locate(context.constants.outputDir.main + '/README.md');

    const initialContent = exists(path)
        ? await readFile(path, 'utf8')
        : `# ${context.constants.appName}

## Commands
[//]: # (Insert any custom documentation ABOVE this line)
[//]: # (DOCS_START)
[//]: # (DOCS_END)
[//]: # (Insert any custom documentation BELOW this line)
`;

    let innerContent = '';

    if (context.constants.maxDepth === null || context.constants.maxDepth > 0) {
        innerContent = createRefs(context, descriptor);
    } else {
        for (const commandName in descriptor) {
            const command = descriptor[commandName];
            convertCommand(commandName, command, context);
        }

        while (context.common.files.length) {
            const file = context.common.files.shift()!;
            innerContent += file.content.replace(/^#+\s(.+)\n/gm, (match) =>
                file.depth > 2
                    ? `**${match.replace(/#/g, '').trim()}**\n`
                    : `##${new Array(file.depth).fill('#').join('')}${match}`
            );
        }

        context.common.files.length = 0;
    }

    const content = initialContent.replace(
        /\[\/\/\]:\s#\s\(DOCS_START\)(.|\n)*\[\/\/\]:\s#\s\(DOCS_END\)/gm,
        `[//]: # (DOCS_START)\n\n${innerContent}\n\n[//]: # (DOCS_END)`
    );

    return {
        path,
        content,
        depth: 0
    };
}

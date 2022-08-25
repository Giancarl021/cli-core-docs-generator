import { FlattenedParentOrChildCommandDescriptor } from './../interfaces/FlattenedHelpDescriptor';
import { CommandTree, FlattenedHelpDescriptor } from '../interfaces';

export default function generateCommandTree(
    appName: string,
    descriptor: FlattenedHelpDescriptor
): CommandTree {
    const tree = {
        name: appName,
        children: []
    } as CommandTree;

    for (const commandName in descriptor) {
        tree.children.push(
            generateCommandSubtree(commandName, descriptor[commandName])
        );
    }

    return tree;
}

function generateCommandSubtree(
    commandName: string,
    command: FlattenedParentOrChildCommandDescriptor
): CommandTree {
    const tree: CommandTree = {
        name: commandName,
        description: command.description,
        children: []
    };

    if (command.isParent) {
        for (const subcommandName in command.subcommands) {
            tree.children.push(
                generateCommandSubtree(
                    subcommandName,
                    command.subcommands[subcommandName]
                )
            );
        }
    }

    return tree;
}

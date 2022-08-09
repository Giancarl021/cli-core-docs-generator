import { ArgDescriptor } from '@giancarl021/cli-core/interfaces';
import {
    FlattenedCommandDescriptor,
    FlattenedFlagsDescriptor,
    FlattenedHelpDescriptor,
    FlattenedParentCommandDescriptor
} from '../interfaces';

const error = new Error('Invalid help descriptor file');

type CommandData =
    | FlattenedCommandDescriptor
    | FlattenedParentCommandDescriptor;

function isValidParentCommand(command: any) {
    return command && typeof command === 'object' && !Array.isArray(command);
}

function parseArgs(args: any): ArgDescriptor[] {
    if (!args) return [];

    if (!Array.isArray(args)) throw error;

    const result: ArgDescriptor[] = [];

    for (const arg of args) {
        if (typeof arg === 'string') {
            result.push({ name: arg });
        } else if (typeof arg === 'object') {
            if (!arg.hasOwnProperty('name') || typeof arg.name !== 'string')
                throw error;
            if (
                arg.hasOwnProperty('optional') &&
                typeof arg.optional !== 'boolean'
            )
                throw error;
            if (
                arg.hasOwnProperty('multiple') &&
                typeof arg.multiple !== 'boolean'
            )
                throw error;

            result.push(arg);
        } else {
            throw error;
        }
    }

    return result;
}

function parseFlags(flags: any): FlattenedFlagsDescriptor {
    if (!flags) return {};

    if (typeof flags !== 'object' || Array.isArray(flags)) throw error;

    const result: FlattenedFlagsDescriptor = {};

    for (const flagName in flags) {
        const flag = flags[flagName];
        if (typeof flag === 'string') {
            result[flagName] = {
                description: flag
            };
        } else if (typeof flag === 'object' && !Array.isArray(flag)) {
            if (
                !flag.hasOwnProperty('description') ||
                typeof flag.description !== 'string'
            )
                throw error;
            if (
                flag.hasOwnProperty('aliases') &&
                (!Array.isArray(flag.aliases) ||
                    !flag.aliases.every((e: any) => typeof e === 'string'))
            )
                throw error;
            if (
                flag.hasOwnProperty('optional') &&
                typeof flag.optional !== 'boolean'
            )
                throw error;
            if (
                flag.hasOwnProperty('values') &&
                (!Array.isArray(flag.values) ||
                    !flag.values.every((e: any) => typeof e === 'string'))
            )
                throw error;

            result[flagName] = flag;
        } else {
            throw error;
        }
    }

    return result;
}

function parseCommand(command: any): CommandData {
    let result: CommandData;

    if (!command) throw error;

    if (typeof command === 'string') {
        const data: FlattenedCommandDescriptor = {
            description: command,
            isParent: false,
            args: [],
            flags: {}
        };

        result = data;
    } else if (typeof command === 'object' && !Array.isArray(command)) {
        if (
            command.hasOwnProperty('description') &&
            typeof command.description !== 'string'
        )
            throw error;

        if (command.hasOwnProperty('subcommands')) {
            if (!isValidParentCommand(command.subcommands)) throw error;
            const data: FlattenedParentCommandDescriptor = {
                description: command.description,
                isParent: true,
                subcommands: parseHelpDescriptor(command.subcommands)
            };

            result = data;
        } else {
            const data: FlattenedCommandDescriptor = {
                description: command.description,
                isParent: false,
                args: parseArgs(command.args),
                flags: parseFlags(command.flags)
            };

            result = data;
        }
    } else throw error;

    return result;
}

export default function parseHelpDescriptor(
    data: any
): FlattenedHelpDescriptor {
    const result: FlattenedHelpDescriptor = {};
    const _data = { ...data };

    if (_data.hasOwnProperty('$schema')) delete _data['$schema'];

    if (!isValidParentCommand(_data)) throw error;

    for (const commandName in _data) {
        const command = _data[commandName];

        result[commandName] = parseCommand(command);
    }

    return result;
}

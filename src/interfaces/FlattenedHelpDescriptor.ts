import {
    ArgDescriptor,
    FlagDescriptor
} from '@giancarl021/cli-core/interfaces';

export interface FlattenedFlagsDescriptor {
    [flagName: string]: FlagDescriptor;
}

export interface FlattenedCommandDescriptor {
    isParent: false;
    description: string;
    args: ArgDescriptor[];
    flags: FlattenedFlagsDescriptor;
}

export type FlattenedParentOrChildCommandDescriptor =
    | FlattenedParentCommandDescriptor
    | FlattenedCommandDescriptor;

export interface FlattenedParentCommandDescriptor {
    description?: string;
    isParent: true;
    subcommands: FlattenedHelpDescriptor;
}

interface FlattenedHelpDescriptor {
    [commandName: string]: FlattenedParentOrChildCommandDescriptor;
}

export default FlattenedHelpDescriptor;

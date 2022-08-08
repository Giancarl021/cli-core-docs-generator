import {
    ArgDescriptor,
    FlagDescriptor
} from '@giancarl021/cli-core/interfaces';

export interface FlattenedFlagsDescriptor {
    [flagName: string]: FlagDescriptor;
}

export interface FlattenedCommandDescriptor {
    description: string;
    args: ArgDescriptor[];
    flags: FlattenedFlagsDescriptor;
}

export interface FlattenedParentCommandDescriptor {
    description?: string;
    subcommands: {
        [commandName: string]:
            | FlattenedParentCommandDescriptor
            | FlattenedCommandDescriptor;
    };
}

interface FlattenedHelpDescriptor {
    [commandName: string]:
        | FlattenedParentCommandDescriptor
        | FlattenedCommandDescriptor;
}

export default FlattenedHelpDescriptor;

import FlattenedHelpDescriptor from './FlattenedHelpDescriptor';

interface ConverterOptions {
    appName: string;
    descriptor: FlattenedHelpDescriptor;
    outputDir: string;
    auxiliaryDir: string;
    flagPrefix: string;
    singleCharacterFlagPrefix: string;
    depth: number | null;
}

export default ConverterOptions;

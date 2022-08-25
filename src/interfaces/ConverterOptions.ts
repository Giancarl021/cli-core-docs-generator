import FlattenedHelpDescriptor from './FlattenedHelpDescriptor';

interface ConverterOptions {
    appName: string;
    descriptor: FlattenedHelpDescriptor;
    outputDir: string;
    auxiliaryDir: string;
    flagPrefix: string;
    singleCharacterFlagPrefix: string;
    flat: boolean;
}

export default ConverterOptions;

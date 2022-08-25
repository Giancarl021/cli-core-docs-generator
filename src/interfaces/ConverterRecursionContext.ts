import DocFile from './DocFile';

interface ConverterRecursionContext {
    constants: {
        appName: string;
        isFlat: boolean;
        outputDir: {
            main: string;
            auxiliary: string;
        };
        flags: {
            flagPrefix: string;
            singleCharacterFlagPrefix: string;
        };
    };
    common: {
        files: DocFile[];
    };
    variables: {
        depth: number;
        commandChain: string[];
    };
}

export default ConverterRecursionContext;

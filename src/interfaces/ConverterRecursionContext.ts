import DocFile from './DocFile';

interface ConverterRecursionContext {
    constants: {
        appName: string;
        maxDepth: number | null;
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

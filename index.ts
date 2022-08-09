#!/usr/bin/env node
import CliCore from '@giancarl021/cli-core';
import { Behavior } from '@giancarl021/cli-core/interfaces';

import * as commands from './src/commands';
import help from './src/util/help.json';

const APP_NAME = 'cli-core-docs-generator';
const DEBUG_MODE = String(process.env.CCDG_DEBUG).toLowerCase() === 'true';

async function main() {
    const behavior: Behavior = {};

    if (DEBUG_MODE) {
        behavior.exitOnError = false;
        behavior.returnResult = true;
    }

    const runner = CliCore(APP_NAME, {
        appDescription:
            'Generate Markdown files from a help descriptor file of a cli-core project',
        args: {
            flags: {
                helpFlags: ['?', 'h', 'help']
            }
        },
        behavior,
        commands,
        help
    });

    return await runner.run();
}

const commandPromise = main();

if (DEBUG_MODE) {
    commandPromise.then(console.log).catch(console.error);
}

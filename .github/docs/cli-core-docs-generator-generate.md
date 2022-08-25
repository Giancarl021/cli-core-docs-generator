# generate

Generates documentation files in Markdown format using a help descriptor file of a @giancarl021/cli-core project

## Usage

```bash
cli-core-docs-generator generate <app-name> <path/to/help-descriptor> <flags>
```

## Flags

-   `--output-directory` | `--output-dir` | `-o`: The output directory where the main file will be written. If omitted will use the current working directory. Value: `<path/to/output-directory>`;
-   `--auxiliary-directory` | `--auxiliary-dir` | `-a`: The output directory where the auxiliary files will be written. If omitted will use <current working directory>/docs. Value: `<path/to/auxiliary-directory>`;
-   `--flat`: Generates only a single file with all the documentation. If omitted will be false;
-   `--force` | `-f`: If the auxiliary directory already exists, delete before generation. If omitted will be false and throw an error if the directory already exists;
-   `--flag-prefix`: The prefix for flags. If omitted will be '--'. Value: `<flag-prefix>`;
-   `--single-character-flag-prefix`: The prefix for single character flags. If omitted will be '-'. Value: `<single-character-flag-prefix>`.

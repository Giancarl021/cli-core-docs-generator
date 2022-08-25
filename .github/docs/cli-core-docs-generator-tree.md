# tree

Prints the tree of commands of a @giancarl021/cli-core project using a help descriptor file

## Usage

```bash
cli-core-docs-generator tree <path/to/help-descriptor> <flags>
```

## Flags

-   `--app-name` | `-n`: The name of the application. If omitted will be '@giancarl021/cli-core app'. Value: `<app-name>`;
-   `--json` | `-j`: Prints the result tree in JSON format. If omitted will be false;
-   `--description` | `-d`: Includes the description of each command in the resulting tree. If omitted will be false.

interface CommandTree {
    name: string;
    description?: string;
    children: CommandTree[];
}

export default CommandTree;

import { AsciiTree } from 'oo-ascii-tree';
import { CommandTree } from '../interfaces';

export function generateAsciiTree(
    tree: CommandTree,
    includeDescription: boolean
): string {
    const root = fillChildren(tree);

    return root.toString();

    function getNode(tree: CommandTree) {
        return `${tree.name}${
            includeDescription ? `: ${tree.description}` : ''
        }`;
    }

    function fillChildren(tree: CommandTree): AsciiTree {
        const root = new AsciiTree(getNode(tree));

        if (!tree.children.length) return root;

        for (const child of tree.children) {
            const childTree = fillChildren(child);

            root.add(childTree);
        }

        return root;
    }
}

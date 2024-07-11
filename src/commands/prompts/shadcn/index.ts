import { confirm, select } from "@inquirer/prompts";
import chalk from "chalk";

export async function PromptStyle() {
    const style = await select({
        message: "Select a style",
        choices: [
            { name: chalk.gray("Default"), value: "default" },
            { name: chalk.gray("New York"), value: "new-york" },
        ]
    });

    return style;
}

export async function PromptBaseColour() {
    const baseColor = await select({
        message: "Select a base colour",
        choices: [
            { name: chalk.gray("Gray"), value: "gray" },
            { name: chalk.gray("Neutral"), value: "neutral" },
            { name: chalk.gray("Slate"), value: "slate" },
            { name: chalk.gray("Zinc"), value: "zinc" },
            { name: chalk.gray("Stone"), value: "stone" },
        ]
    });
    return baseColor;
}

export async function PromptComponents() {
    return await confirm({
        message: "Do you want to add all Shadcn components?",
        default: false,
        transformer: (value) => chalk.magenta(value)
    });
};

import { input, select } from "@inquirer/prompts";
import chalk from "chalk";


export interface BaseOptions { projectName: string, manager: string, ui: string, typescript: boolean };

export async function BasePrompts(): Promise<BaseOptions> {
    return {
        projectName: await input({ message: "Project name?" }),
        manager: await ManagerPrompts(),
        typescript: await LanguagePrompt(),
        ui: await UIPrompts(),
    }
}

export async function ManagerPrompts() {
    const manager = await select({
        message: "Choose a package manager",
        choices: [
            { name: chalk.gray("Yarn"), value: "yarn" },
            { name: chalk.gray("NPM"), value: "npm" },
            { name: chalk.gray("Bun"), value: "bun" },
        ]
    });
    return manager;
};

export async function LanguagePrompt() {
    const lang = await select({
        message: "Select language",
        choices: [
            { name: chalk.gray("Typescript"), value: "ts" },
            { name: chalk.gray("Javascript"), value: "js" },
        ],
    });
    return lang === "ts" ? true : false
}

export async function UIPrompts() {
    const ui: string | null = await select({
        message: "Choose a UI framework",
        choices: [
            { name: chalk.gray("Shadcn"), value: "shadcn" },
            { name: chalk.gray("Daisy UI"), value: "daisy-ui" },
            { name: chalk.gray("Material UI"), value: "mui" },
            { name: chalk.gray("Next UI"), value: "next-ui" },
        ]
    });
    return ui;
};

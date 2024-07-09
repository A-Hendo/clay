import { input, select } from "@inquirer/prompts";


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
            { name: "Yarn", value: "yarn" },
            { name: "NPM", value: "npm" },
            { name: "Bun", value: "bun" },
        ]
    });
    return manager;
};

export async function LanguagePrompt() {
    const lang = await select({
        message: "Select language",
        choices: [
            { name: "Typescript", value: "ts" },
            { name: "Javascript", value: "js" },
        ],
    });
    return lang === "ts" ? true : false
}

export async function UIPrompts() {
    const ui: string | null = await select({
        message: "Choose a UI framework",
        choices: [
            { name: "Shadcn", value: "shadcn" },
            { name: "Daisy UI", value: "daisy-ui" },
        ]
    });
    return ui;
};

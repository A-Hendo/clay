import { select } from "@inquirer/prompts";


export interface BaseOptions { css: string | null, manager: string, ui: string, typescript: boolean };

export async function BasePrompts(): Promise<BaseOptions> {
    return {
        manager: await ManagerPrompts(),
        typescript: await LanguagePrompt(),
        css: await CSSPrompts(),
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


export async function CSSPrompts() {
    const ui: string | null = await select({
        message: "Do you want to use Tailwind or Bootstrap?",
        choices: [
            { name: "Tailwind", value: "tailwind" },
            { name: "Bootstrap", value: "bootstrap" },
            { name: "None", value: null },
        ]
    });
    return ui;
};


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

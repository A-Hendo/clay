import { Choice, Input, Select } from "../utils/prompts.js";


export interface BaseOptions { projectName: string, manager: string, ui: string, typescript: boolean };

export async function BasePrompts(): Promise<BaseOptions> {
    return {
        projectName: await Input("Project name?"),
        manager: await ManagerPrompts(),
        typescript: await LanguagePrompt(),
        ui: await UIPrompts(),
    }
}

export async function ManagerPrompts() {
    const choices: Choice[] = [
        { name: "Yarn", value: "yarn" },
        { name: "NPM", value: "npm" },
        { name: "Bun", value: "bun" },
    ]
    return await Select("Choose a package manager", choices);
};

export async function LanguagePrompt() {
    const choices: Choice[] = [
        { name: "Typescript", value: "ts" },
        { name: "Javascript", value: "js" },
    ]
    const lang = await Select("Select language", choices);

    return lang === "ts" ? true : false
}

export async function UIPrompts() {
    const choices: Choice[] = [
        { name: "Shadcn", value: "shadcn" },
        { name: "Daisy UI", value: "daisy-ui" },
        { name: "Material UI", value: "mui" },
        { name: "Next UI", value: "next-ui" },
    ]

    return await Select("Choose a UI framework", choices);
};

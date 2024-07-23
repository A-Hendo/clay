import { Choice, Input, Select } from "../utils/prompts.js";


export interface BaseOptions { name: string, manager: string, typescript: boolean };

export async function BasePrompts(): Promise<BaseOptions> {
    return {
        name: await Input("Project name?"),
        manager: await ManagerPrompts(),
        typescript: await LanguagePrompt(),
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

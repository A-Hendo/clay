import { select } from "@inquirer/prompts";

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

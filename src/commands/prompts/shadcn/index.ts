import { select } from "@inquirer/prompts";

export async function PromptStyle() {
    const style = await select({
        message: "Select a style",
        choices: [
            { name: "Default", value: "default" },
            { name: "New York", value: "new-york" },
        ]
    });

    return style;
}

export async function PromptBaseColour() {
    const baseColor = await select({
        message: "Select a base colour",
        choices: [
            { name: "Gray", value: "gray" },
            { name: "Neutral", value: "neutral" },
            { name: "Slate", value: "slate" },
            { name: "Zinc", value: "zinc" },
            { name: "Stone", value: "stone" },
        ]
    });
    return baseColor;
}

export async function PromptComponents() {
    return confirm("Do you want to add all Shadcn components?");
};

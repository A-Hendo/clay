import { Choice, Confirm, Select } from "../../../utils/prompts.js";

export async function PromptStyle() {
    const choices: Choice[] = [
        { name: "Default", value: "default" },
        { name: "New York", value: "new-york" },
    ]
    return await Select("Select a style", choices);
}

export async function PromptBaseColour() {
    const choices: Choice[] = [
        { name: "Gray", value: "gray" },
        { name: "Neutral", value: "neutral" },
        { name: "Slate", value: "slate" },
        { name: "Zinc", value: "zinc" },
        { name: "Stone", value: "stone" },
    ];

    return await Select("Select a base colour", choices);
}

export async function PromptComponents() {
    return await Confirm("Do you want to add all Shadcn components?", false);
};

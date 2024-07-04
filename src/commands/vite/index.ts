import { input, select } from "@inquirer/prompts";
import { Command } from "commander";
import { LanguagePrompt, ManagerPrompts, UIPrompts } from "../../commands/index.js";
import { Base } from "../../frameworks/index.js";
import { ReactShadcn } from "../../frameworks/vite/react/shadcn/index.js";
import { PromptBaseColour, PromptComponents, PromptStyle } from "../prompts/shadcn/index.js";


export async function ViteCommands(program: Command) {
    program
        .command("vite")
        .description("Create a new vite project")
        .action(async () => {
            const projectName = await input({ message: "Project name?" });
            const typescript = await LanguagePrompt();
            const packageManager = await ManagerPrompts();
            const template = await ViteTemplatePrompt(typescript);
            const ui = await UIPrompts();

            let project: Base | undefined;

            if (["react", "react-ts", "react-swc-ts", "react-swc"].includes(template)) {
                if (ui === "shadcn") {

                    const style = await PromptStyle();
                    const baseColour = await PromptBaseColour();
                    const components = await PromptComponents();


                    project = new ReactShadcn(
                        projectName,
                        template,
                        packageManager,
                        typescript,
                        style,
                        baseColour,
                        components,
                    );
                }
            } else {
                project = new Base(projectName, template, packageManager, typescript);
            }
            await project?.Create();
        });
}


function ViteTemplatePrompt(typescript: boolean) {
    if (typescript) {
        return select({
            message: "Select a framework",
            choices: [
                { name: "Vanilla", value: "vanilla-ts" },
                { name: "Vue", value: "vue-ts" },
                { name: "React", value: "react-ts" },
                { name: "React-swc", value: "react-swc-ts" },
                { name: "Preract", value: "preract-ts" },
                { name: "Lit", value: "lit-ts" },
                { name: "Svelte", value: "svelte-ts" },
                { name: "Solid", value: "solid-ts" },
                { name: "Qwik", value: "qwik-ts" },
            ],
        })
    };

    return select({
        message: "Select a framework",
        choices: [
            { name: "Vanilla", value: "vanilla" },
            { name: "Vue", value: "vue" },
            { name: "React", value: "react" },
            { name: "React-swc", value: "react-swc" },
            { name: "Preract", value: "preract" },
            { name: "Lit", value: "lit" },
            { name: "Svelte", value: "svelte" },
            { name: "Solid", value: "solid" },
            { name: "Qwik", value: "qwik" },
        ],
    })
};

import { select } from "@inquirer/prompts";
import { Command } from "commander";
import * as fs from "fs";
import ora from "ora";
import * as path from "path";
import { BaseOptions, BasePrompts } from "../../commands/index.js";
import { Base } from "../../frameworks/index.js";
import { ReactDaisyUI } from "../../frameworks/vite/react/daisy-ui/index.js";
import { ReactMUI } from "../../frameworks/vite/react/material-ui/index.js";
import { ReactShadcn } from "../../frameworks/vite/react/shadcn/index.js";
import { SvelteDaisyUI } from "../../frameworks/vite/svelte/daisy-ui/index.js";
import { SvelteShadcn } from "../../frameworks/vite/svelte/shadcn/index.js";
import { PromptBaseColour, PromptComponents, PromptStyle } from "../prompts/shadcn/index.js";

export async function ViteCommands(program: Command) {
    program
        .command("vite")
        .description("Create a new vite project")
        .action(async () => {
            const baseOptions: BaseOptions = await BasePrompts();
            const template = await ViteTemplatePrompt(baseOptions.typescript);


            const projectPath = path.join(process.cwd(), baseOptions.projectName);

            if (fs.existsSync(projectPath)) {
                console.error(`Project folder ${baseOptions.projectName} already exists!`);
                process.exit(1);
            }

            let project: Base | undefined;

            if (["react", "react-ts", "react-swc-ts", "react-swc"].includes(template)) {
                if (baseOptions.ui === "shadcn") {

                    const style = await PromptStyle();
                    const baseColour = await PromptBaseColour();
                    const components = await PromptComponents();


                    project = new ReactShadcn(
                        baseOptions.projectName,
                        template,
                        baseOptions.manager,
                        baseOptions.typescript,
                        style,
                        baseColour,
                        components,
                    );
                } else if (baseOptions.ui === "daisy-ui") {
                    project = new ReactDaisyUI(
                        baseOptions.projectName,
                        template,
                        baseOptions.manager,
                        baseOptions.typescript,
                    )
                } else if (baseOptions.ui === "mui") {
                    project = new ReactMUI(
                        baseOptions.projectName, template, baseOptions.manager, baseOptions.typescript
                    );
                }
            } else if (["svelte", "svelte-ts"].includes(template)) {
                if (baseOptions.ui === "shadcn") {
                    const style = await PromptStyle();
                    const baseColour = await PromptBaseColour();
                    const components = await PromptComponents();

                    project = new SvelteShadcn(
                        baseOptions.projectName,
                        template,
                        baseOptions.manager,
                        baseOptions.typescript,
                        style,
                        baseColour,
                        components,
                    );
                } else if (baseOptions.ui === "daisy-ui") {
                    project = new SvelteDaisyUI(
                        baseOptions.projectName, template, baseOptions.manager, baseOptions.typescript
                    );
                }
            } else {
                project = new Base(baseOptions.projectName, template, baseOptions.manager, baseOptions.typescript);
            }

            const spinner = ora(`Creating Vite ${template} project...`).start();
            spinner.color = "green";

            await project?.Create();

            spinner.stop();
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

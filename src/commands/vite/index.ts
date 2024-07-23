import { ExitPromptError } from "@inquirer/core";
import chalk from "chalk";
import { Command } from "commander";
import * as fs from "fs";
import ora from "ora";
import * as path from "path";
import { BaseOptions, BasePrompts } from "../../commands/index.js";
import { Base } from "../../frameworks/index.js";
import { ReactDaisyUI } from "../../frameworks/vite/react/daisy-ui/index.js";
import { ReactMUI } from "../../frameworks/vite/react/material-ui/index.js";
import { ReactNextUI } from "../../frameworks/vite/react/next-ui/index.js";
import { PrimeReact } from "../../frameworks/vite/react/primereact/index.js";
import { ReactShadcn } from "../../frameworks/vite/react/shadcn/index.js";
import { SvelteDaisyUI } from "../../frameworks/vite/svelte/daisy-ui/index.js";
import { SvelteShadcn } from "../../frameworks/vite/svelte/shadcn/index.js";
import { Choice, Select } from "../../utils/prompts.js";
import { PromptBaseColour, PromptComponents, PromptStyle } from "../prompts/shadcn/index.js";

export async function ViteCommands(program: Command) {
    program
        .command("vite")
        .description("Create a new vite project")
        .action(async () => {
            try {

                const baseOptions: BaseOptions = await BasePrompts();
                const template = await ViteTemplatePrompt(baseOptions.typescript);

                const projectPath = path.join(process.cwd(), baseOptions.name);

                if (fs.existsSync(projectPath)) {
                    console.error("❌ ", chalk.red(`Project folder ${baseOptions.name} already exists!`));
                    process.exit(1);
                }

                let project: Base | undefined;

                if (["react", "react-ts", "react-swc-ts", "react-swc"].includes(template)) {
                    const choices: Choice[] = [
                        { name: "Shadcn", value: "shadcn" },
                        { name: "Daisy UI", value: "daisy-ui" },
                        { name: "Material UI", value: "mui" },
                        { name: "Next UI", value: "next-ui" },
                        { name: "Skeleton UI", value: "skeleton-ui" },
                        { name: "PrimeReact", value: "primereact" },
                    ]

                    const ui = await Select("Choose a UI framework", choices);

                    if (ui === "shadcn") {

                        const style = await PromptStyle();
                        const baseColour = await PromptBaseColour();
                        const components = await PromptComponents();


                        project = new ReactShadcn(
                            baseOptions.name,
                            template,
                            baseOptions.manager,
                            baseOptions.typescript,
                            style,
                            baseColour,
                            components,
                        );
                    } else if (ui === "daisy-ui") {
                        project = new ReactDaisyUI(
                            baseOptions.name,
                            template,
                            baseOptions.manager,
                            baseOptions.typescript,
                        )
                    } else if (ui === "mui") {
                        project = new ReactMUI(
                            baseOptions.name, template, baseOptions.manager, baseOptions.typescript
                        );
                    } else if (ui === "next-ui") {
                        project = new ReactNextUI(
                            baseOptions.name, template, baseOptions.manager, baseOptions.typescript
                        );
                    } else if (ui === "primereact") {
                        project = new PrimeReact(
                            baseOptions.name, template, baseOptions.manager, baseOptions.typescript
                        )
                    }
                } else if (["svelte", "svelte-ts"].includes(template)) {
                    const choices: Choice[] = [
                        { name: "Shadcn", value: "shadcn" },
                        { name: "Daisy UI", value: "daisy-ui" },
                    ]

                    const ui = await Select("Choose a UI framework", choices);

                    if (ui === "shadcn") {
                        const style = await PromptStyle();
                        const baseColour = await PromptBaseColour();
                        const components = await PromptComponents();

                        project = new SvelteShadcn(
                            baseOptions.name,
                            template,
                            baseOptions.manager,
                            baseOptions.typescript,
                            style,
                            baseColour,
                            components,
                        );
                    } else if (ui === "daisy-ui") {
                        project = new SvelteDaisyUI(
                            baseOptions.name, template, baseOptions.manager, baseOptions.typescript
                        );
                    }
                } else {
                    project = new Base(baseOptions.name, baseOptions.manager, baseOptions.typescript);
                }

                const spinner = ora(chalk.cyan(`Creating Vite ${template} project`)).start();
                spinner.color = "green";

                await project?.Create();

                spinner.stop();

                console.log("✔️ ", chalk.green(`Project ${baseOptions.name} created successfully!`));

            } catch (error) {
                if (error instanceof ExitPromptError) {
                    console.error("❌ ", chalk.red("User cancelled operation"));
                    process.exit();
                }
                throw (error);
            };
        });
}


async function ViteTemplatePrompt(typescript: boolean) {
    let choices: Choice[] = [];

    if (typescript)
        choices = [
            { name: "Vanilla", value: "vanilla-ts" },
            { name: "Vue", value: "vue-ts" },
            { name: "React", value: "react-ts" },
            { name: "React-swc", value: "react-swc-ts" },
            { name: "Preract", value: "preract-ts" },
            { name: "Lit", value: "lit-ts" },
            { name: "Svelte", value: "svelte-ts" },
            { name: "Solid", value: "solid-ts" },
            { name: "Qwik", value: "qwik-ts" },
        ]
    else
        choices = [
            { name: "Vanilla", value: "vanilla" },
            { name: "Vue", value: "vue" },
            { name: "React", value: "react" },
            { name: "React-swc", value: "react-swc" },
            { name: "Preract", value: "preract" },
            { name: "Lit", value: "lit" },
            { name: "Svelte", value: "svelte" },
            { name: "Solid", value: "solid" },
            { name: "Qwik", value: "qwik" },
        ]
    return await Select("Select a framework", choices);
};

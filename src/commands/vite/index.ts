import { ExitPromptError } from "@inquirer/core";
import { select } from "@inquirer/prompts";
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
import { ReactShadcn } from "../../frameworks/vite/react/shadcn/index.js";
import { SvelteDaisyUI } from "../../frameworks/vite/svelte/daisy-ui/index.js";
import { SvelteShadcn } from "../../frameworks/vite/svelte/shadcn/index.js";
import { PromptBaseColour, PromptComponents, PromptStyle } from "../prompts/shadcn/index.js";

export async function ViteCommands(program: Command) {
    program
        .command("vite")
        .description("Create a new vite project")
        .action(async () => {
            try {

                const baseOptions: BaseOptions = await BasePrompts();
                const template = await ViteTemplatePrompt(baseOptions.typescript);


                const projectPath = path.join(process.cwd(), baseOptions.projectName);

                if (fs.existsSync(projectPath)) {
                    console.error(chalk.red(`Project folder ${baseOptions.projectName} already exists!`));
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
                    } else if (baseOptions.ui === "next-ui") {
                        project = new ReactNextUI(
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

                console.log(chalk.green(`✔️ Project ${baseOptions.projectName} created successfully!`));

            } catch (error) {
                if (error instanceof ExitPromptError) {
                    console.error(chalk.red("❌ User cancelled operation"));
                    process.exit();
                }
                throw (error);
            };
        });
}


function ViteTemplatePrompt(typescript: boolean) {
    if (typescript) {
        return select({
            message: "Select a framework",
            choices: [
                { name: chalk.gray("Vanilla"), value: "vanilla-ts" },
                { name: chalk.gray("Vue"), value: "vue-ts" },
                { name: chalk.gray("React"), value: "react-ts" },
                { name: chalk.gray("React-swc"), value: "react-swc-ts" },
                { name: chalk.gray("Preract"), value: "preract-ts" },
                { name: chalk.gray("Lit"), value: "lit-ts" },
                { name: chalk.gray("Svelte"), value: "svelte-ts" },
                { name: chalk.gray("Solid"), value: "solid-ts" },
                { name: chalk.gray("Qwik"), value: "qwik-ts" },
            ],
        })
    };

    return select({
        message: "Select a framework",
        choices: [
            { name: chalk.gray("Vanilla"), value: "vanilla" },
            { name: chalk.gray("Vue"), value: "vue" },
            { name: chalk.gray("React"), value: "react" },
            { name: chalk.gray("React-swc"), value: "react-swc" },
            { name: chalk.gray("Preract"), value: "preract" },
            { name: chalk.gray("Lit"), value: "lit" },
            { name: chalk.gray("Svelte"), value: "svelte" },
            { name: chalk.gray("Solid"), value: "solid" },
            { name: chalk.gray("Qwik"), value: "qwik" },
        ],
    })
};

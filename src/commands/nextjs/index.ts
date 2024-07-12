import { ExitPromptError } from "@inquirer/core";
import chalk from "chalk";
import { Command } from "commander";
import * as fs from "fs";
import ora from "ora";
import * as path from "path";
import { Base } from "../../frameworks/index.js";
import { DaisyUI } from "../../frameworks/nextjs/daisy-ui/index.js";
import { MUI } from "../../frameworks/nextjs/material-ui/index.js";
import { NextUI } from "../../frameworks/nextjs/next-ui/index.js";
import { Shadcn } from "../../frameworks/nextjs/shadcn/index.js";
import { Confirm, Input } from "../../utils/prompts.js";
import { BaseOptions, BasePrompts } from "../index.js";
import { PromptBaseColour, PromptComponents, PromptStyle } from "../prompts/shadcn/index.js";



export async function NextjsCommands(program: Command) {
    program
        .command("nextjs")
        .description("Create a new nextjs project")
        .action(async () => {
            try {
                const baseOptions: BaseOptions = await BasePrompts();

                const eslint = await EslintPrompt();
                const router = await RouterPrompt();
                const alias = await ImportAliasPrompt();
                const src = await SrcDirPrompt();

                const projectPath = path.join(process.cwd(), baseOptions.name);

                if (fs.existsSync(projectPath)) {
                    console.error("❌ ", chalk.red(`Project folder ${baseOptions.name} already exists!`));
                    process.exit(1);
                }

                let project: Base | undefined;

                if (baseOptions.ui === "shadcn") {
                    const style = await PromptStyle();
                    const baseColour = await PromptBaseColour();
                    const components = await PromptComponents();

                    project = new Shadcn(baseOptions.name,
                        baseOptions.manager,
                        baseOptions.typescript,
                        router,
                        alias,
                        eslint,
                        src,
                        style,
                        baseColour,
                        components);

                } else if (baseOptions.ui === "daisy-ui") {
                    project = new DaisyUI(
                        baseOptions.name,
                        baseOptions.manager,
                        baseOptions.typescript,
                        router,
                        alias,
                        eslint,
                        src
                    );
                } else if (baseOptions.ui === "next-ui") {
                    project = new NextUI(
                        baseOptions.name,
                        baseOptions.manager,
                        baseOptions.typescript,
                        router,
                        alias,
                        eslint,
                        src
                    );
                } else if (baseOptions.ui === "mui") {
                    project = new MUI(
                        baseOptions.name,
                        baseOptions.manager,
                        baseOptions.typescript,
                        router,
                        alias,
                        eslint,
                        src
                    )
                }

                const spinner = ora(chalk.cyan("Creating NextJs project")).start();
                spinner.color = "green";

                await project?.Create();

                spinner.stop();

                console.log("✔️ ", chalk.green(`Project ${baseOptions.name} created successfully!`));
            }
            catch (error) {
                if (error instanceof ExitPromptError) {
                    console.error("❌ ", chalk.red("User cancelled operation"));
                    process.exit();
                }
                throw (error);
            };

        });
}

async function EslintPrompt() {
    return await Confirm("Enable ESLint?");
}

async function RouterPrompt() {
    return await Confirm("Use App Router?");
}

async function ImportAliasPrompt() {

    const change = await Confirm("Change default import alias ('@/*')?", false);

    if (!change)
        return "@/*"

    const alias = await Input("Change default import alias ('@/*')?");

    return alias === "" ? "@/*" : alias;
}

async function SrcDirPrompt() {
    return await Confirm("Use src directory?");
}

import { ExitPromptError } from "@inquirer/core";
import { confirm, input } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import * as fs from "fs";
import ora from "ora";
import * as path from "path";
import { Base } from "../../frameworks/index.js";
import { DaisyUI } from "../../frameworks/nextjs/daisy-ui/index.js";
import { NextUI } from "../../frameworks/nextjs/next-ui/index.js";
import { Shadcn } from "../../frameworks/nextjs/shadcn/index.js";
import { LanguagePrompt, ManagerPrompts, UIPrompts } from "../index.js";
import { PromptBaseColour, PromptComponents, PromptStyle } from "../prompts/shadcn/index.js";



export async function NextjsCommands(program: Command) {
    program
        .command("nextjs")
        .description("Create a new nextjs project")
        .action(async () => {
            try {

                const projectName = await input(
                    { message: "Project name?", transformer: (value) => chalk.magenta(value) }
                );
                const typescript = await LanguagePrompt();
                const packageManager = await ManagerPrompts();
                const ui = await UIPrompts();

                const eslint = await EslintPrompt();
                const router = await RouterPrompt();
                const alias = await ImportAliasPrompt();
                const src = await SrcDirPrompt();

                const projectPath = path.join(process.cwd(), projectName);

                if (fs.existsSync(projectPath)) {
                    console.error(chalk.red(`Project folder ${projectName} already exists!`));
                    process.exit(1);
                }

                let project: Base | undefined;

                if (ui === "shadcn") {
                    const style = await PromptStyle();
                    const baseColour = await PromptBaseColour();
                    const components = await PromptComponents();

                    project = new Shadcn(projectName,
                        "default",
                        packageManager,
                        typescript,
                        router,
                        alias,
                        eslint,
                        src,
                        style,
                        baseColour,
                        components);

                } else if (ui === "daisy-ui") {
                    project = new DaisyUI(
                        projectName, "default", packageManager, typescript, router, alias, eslint, src
                    );
                } else if (ui === "next-ui") {
                    project = new NextUI(
                        projectName, "default", packageManager, typescript, router, alias, eslint, src
                    );
                }

                const spinner = ora(chalk.cyan("Creating NextJs project")).start();
                spinner.color = "green";

                await project?.Create();

                spinner.stop();

                console.log(chalk.green(`✔️ Project ${projectName} created successfully!`));
            }
            catch (error) {
                if (error instanceof ExitPromptError) {
                    console.error(chalk.red("❌ User cancelled operation"));
                    process.exit();
                }
                throw (error);
            };

        });
}

async function EslintPrompt() {
    return await confirm({ message: "Enable ESLint?", transformer: (value) => chalk.magenta(value) });
}

async function RouterPrompt() {
    return await confirm({ message: "Use App Router?", transformer: (value) => chalk.magenta(value) });
}

async function ImportAliasPrompt() {

    const change = await confirm({
        message: "Change default import alias ('@/*')?",
        default: false,
        transformer: (value) => chalk.magenta(value)
    });

    if (!change)
        return "@/*"

    const alias = await input({
        message: "Change default import alias ('@/*')?",
        transformer: (value) => chalk.magenta(value)
    });

    return alias === "" ? "@/*" : alias;
}

async function SrcDirPrompt() {
    return await confirm({ message: "Use src directory?", transformer: (value) => chalk.magenta(value) });
}

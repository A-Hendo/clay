import { confirm, input } from "@inquirer/prompts";
import { Command } from "commander";
import * as fs from "fs";
import ora from "ora";
import * as path from "path";
import { Base } from "../../frameworks/index.js";
import { DaisyUI } from "../../frameworks/nextjs/daisy-ui/index.js";
import { Shadcn } from "../../frameworks/nextjs/shadcn/index.js";
import { LanguagePrompt, ManagerPrompts, UIPrompts } from "../index.js";
import { PromptBaseColour, PromptComponents, PromptStyle } from "../prompts/shadcn/index.js";



export async function NextjsCommands(program: Command) {
    program
        .command("nextjs")
        .description("Create a new nextjs project")
        .action(async () => {
            const projectName = await input({ message: "Project name?" });
            const typescript = await LanguagePrompt();
            const packageManager = await ManagerPrompts();
            const ui = await UIPrompts();

            const eslint = await EslintPrompt();
            const router = await RouterPrompt();
            const alias = await ImportAliasPrompt();
            const src = await SrcDirPrompt();

            const projectPath = path.join(process.cwd(), projectName);

            if (fs.existsSync(projectPath)) {
                console.error(`Project folder ${projectName} already exists!`);
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
                project = new DaisyUI(projectName, "default", packageManager, typescript, router, alias, eslint, src);
            }

            const spinner = ora("Creating NextJs project...").start();
            spinner.color = "green";

            await project?.Create();

            spinner.stop();

        });
}

async function EslintPrompt() {
    return await confirm({ message: "Enable ESLint?" });
}

async function RouterPrompt() {
    return await confirm({ message: "Use App Router?" });
}

async function ImportAliasPrompt() {

    const change = await confirm({ message: "Change default import alias ('@/*')?", default: false });

    if (!change)
        return "@/*"

    const alias = await input({ message: "Change default import alias ('@/*')?" });

    return alias === "" ? "@/*" : alias;
}

async function SrcDirPrompt() {
    return await confirm({ message: "Use src directory?" });
}

import { ExitPromptError } from "@inquirer/core";
import chalk from "chalk";
import { Command } from "commander";
import * as fs from "fs";
import ora from "ora";
import * as path from "path";
import { Base } from "../../frameworks/index.js";
import { SvelteKitDaisyUI } from "../../frameworks/sveltekit/daisy-ui/index.js";
import { SvelteKitShadcn } from "../../frameworks/sveltekit/shadcn/index.js";
import { Checkbox, Confirm, Select } from "../../utils/prompts.js";
import { BasePrompts } from "../index.js";
import { PromptBaseColour, PromptComponents, PromptStyle } from "../prompts/shadcn/index.js";

interface shadcnOptions { style: string, baseColour: string, components: boolean }

interface Options {
    template: string;
    types: string | null;
    prettier: boolean;
    eslint: boolean;
    playwright: boolean;
    vitest: boolean;
    svelte5: boolean;
};

export async function SvelteKitCommands(program: Command) {
    program
        .command("sveltekit")
        .description("Create a new project")
        // .option("-n, --name", "Project name", "my-app")
        // .addOption(
        //     new Option("-t, --template", "Select a Project template")
        //         .choices(["default", "skeleton", "skeletonlib"])
        //         .default("default"))
        // .addOption(
        //     new Option("-y, --types", "Which typechecking to use?")
        //         .choices(["typescript", "checkjs", "null"])
        //         .default("checkjs"))
        // .option("-p, --prettier", "Use Prettier", false)
        // .option("-e, --eslint", "Use ESLint", false)
        // .option("-w, --playwright", "Use Playwright", false)
        // .option("-v, --vitest", "Use Vitest", false)
        // .option("-s, --svelte", "Use Svelte", false)
        .option("-i, --interactive", "Enable interactive mode", true)
        // .addOption(
        //     new Option("-l, --lang <lang>", "Typescript or Javascript?")
        //         .choices(["Typescript", "Javascript"])
        //         .default("Typescript"))
        // .addOption(
        //     new Option("-c, --css <css>", "Choose a css framework")
        //         .choices(["tailwind", "bootstrap", "null"])
        //         .default("null"))
        // .addOption(
        //     new Option("-m, --manager <manager>", "Choose a package manager")
        //         .choices(["yarn", "npm", "bun"])
        //         .default("npm"))
        // .addOption(
        //     new Option("-u, --ui <manager>", "Choose a UI framework")
        //         .choices(["Shadcn", "Skeleton UI", "Daisy UI", "none"])
        //         .default("none"))
        .action(async (options: Options) => {
            try {
                const baseOptions = await BasePrompts();

                const projectPath = path.join(process.cwd(), baseOptions.projectName);
                if (fs.existsSync(projectPath)) {
                    console.error("❌ ", chalk.red(`Project folder ${baseOptions.projectName} already exists!`));
                    process.exit(1);
                }

                options = await SveltePrompts();

                let project: Base | undefined;

                if (baseOptions.ui === "shadcn") {
                    const shadcn: shadcnOptions = {
                        style: await PromptStyle(),
                        baseColour: await PromptBaseColour(),
                        components: await PromptComponents(),
                    };

                    project = new SvelteKitShadcn(
                        baseOptions.projectName,
                        options.template,
                        baseOptions.manager,
                        baseOptions.typescript,
                        options.types,
                        options.prettier,
                        options.eslint,
                        options.playwright,
                        options.vitest,
                        options.svelte5,
                        shadcn.style,
                        shadcn.baseColour,
                        shadcn.components
                    );
                } else if (baseOptions.ui === "daisy-ui") {
                    project = new SvelteKitDaisyUI(
                        baseOptions.projectName,
                        options.template,
                        baseOptions.manager,
                        baseOptions.typescript,
                        options.types,
                        options.prettier,
                        options.eslint,
                        options.playwright,
                        options.vitest,
                        options.svelte5,
                    )
                }

                const spinner = ora(chalk.cyan("Creating SvelteKit project")).start();
                spinner.color = "green";

                await project?.Create();

                spinner.stop();

                console.log("✔️ ", chalk.green(`Project ${baseOptions.projectName} created successfully!`));
            } catch (error) {
                if (error instanceof ExitPromptError) {
                    console.error("❌ ", chalk.red("User cancelled operation"));
                    process.exit();
                }
                throw (error);
            };
        });
};

export async function SveltePrompts() {
    const options: Options = {
        template: "",
        types: "",
        prettier: false,
        eslint: false,
        playwright: false,
        vitest: false,
        svelte5: false
    }

    options.template = await Select(
        "Select a project template",
        [{ name: "Skeleton", value: "skeleton" }],
    );

    options.types = await Select(
        "Select typechecking",
        [
            { name: "Typescript", value: "typescript" },
            { name: "Checkjs", value: "checkjs" },
            { name: "None", value: "none" },
        ],
    );

    const choices = await Checkbox(
        "Additional options",
        [
            { name: "Prettier", value: "prettier" },
            { name: "ESLint", value: "eslint" },
            { name: "Playwright", value: "playwright" },
            { name: "Vitest", value: "vitest" },
        ]
    );

    options.prettier = choices.includes("prettier");
    options.eslint = choices.includes("eslint");
    options.playwright = choices.includes("playwright");
    options.vitest = choices.includes("vitest");

    options.svelte5 = await Confirm("Use Svelte 5?");

    return options;
};


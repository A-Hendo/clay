import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { Command } from "commander";
import { type Options } from "create-svelte/types/internal.js";
import * as fs from "fs";
import * as path from "path";
import { Base } from "../../frameworks/index.js";
import { SvelteKitDaisyUI } from "../../frameworks/sveltekit/daisy-ui/index.js";
import { SvelteKitShadcn } from "../../frameworks/sveltekit/shadcn/index.js";
import { BasePrompts } from "../index.js";
import { PromptBaseColour, PromptComponents, PromptStyle } from "../prompts/shadcn/index.js";

type svelteOptions = Options

interface shadcnOptions { style: string, baseColour: string, components: boolean }

export function SvelteKitCommands(program: Command) {
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
        .action(async (options: svelteOptions) => {
            const baseOptions = await BasePrompts();

            options = await SveltePrompts();

            let project: Base | undefined;

            if (baseOptions.ui === "shadcn") {
                const shadcn: shadcnOptions = {
                    style: await PromptStyle(),
                    baseColour: await PromptBaseColour(),
                    components: await PromptComponents(),
                };

                project = new SvelteKitShadcn(
                    options.name,
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
                    options.name,
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

            await project?.Create();
        });
};

export async function SveltePrompts() {
    const options: Options = {
        name: "",
        template: "default",
        types: "checkjs",
        prettier: false,
        eslint: false,
        playwright: false,
        vitest: false,
        svelte5: false,
    };

    options.name = await input({ message: "Project name?" });

    const projectPath = path.join(process.cwd(), options.name);

    if (fs.existsSync(projectPath)) {
        console.error(`Project folder ${options.name} already exists!`);
        process.exit(1);
    }

    options.template = await select({
        message: "Select a project template",
        choices: [
            { name: "Skeleton", value: "skeleton" },
            // { name: "Skeletonlib", value: "skeletonlib" },
        ],
    });

    options.types = await select({
        message: "Select typechecking",
        choices: [
            { name: "Typescript", value: "typescript" },
            { name: "Checkjs", value: "checkjs" },
            { name: "null", value: null },
        ],
    });

    const choices = await checkbox({
        message: "Additional options",
        choices: [
            { name: "Prettier", value: "prettier" },
            { name: "ESLint", value: "eslint" },
            { name: "Playwright", value: "playwright" },
            { name: "Vitest", value: "vitest" },
        ]
    });

    options.prettier = choices.includes("prettier");
    options.eslint = choices.includes("eslint");
    options.playwright = choices.includes("playwright");
    options.vitest = choices.includes("vitest");

    options.svelte5 = await confirm({ message: "Use Svelte 5?" });

    return options;
};


// import { checkbox, confirm, input, select } from "@inquirer/prompts";
// import { Command, Option } from "commander";
// import { type Options } from "create-svelte/types/internal.js";
// import * as fs from "fs";
// import * as path from "path";
// import { CreateSvelte } from "../../frameworks/svelte/index.js";
// import { UIPrompts } from "../../ui/index.js";

// import { GenerateTailwind } from "../../ui/tailwind/index.js";

// type reactOptions = Options & { interactive?: boolean, css?: string | null, manager?: string };

// export function ReactCommands(program: Command) {
//     program
//         .command("nextjs")
//         .description("Create a new project")
//         .option("-n, --name", "Project name", "my-app")
//         .addOption(
//             new Option("-t, --template", "Select a Project template")
//                 .choices(["default", "skeleton", "skeletonlib"])
//                 .default("default"))
//         .addOption(
//             new Option("-y, --types", "Which typechecking to use?")
//                 .choices(["typescript", "checkjs", "null"])
//                 .default("checkjs"))
//         .option("-p, --prettier", "Use Prettier", false)
//         .option("-e, --eslint", "Use ESLint", false)
//         .option("-w, --playwright", "Use Playwright", false)
//         .option("-v, --vitest", "Use Vitest", false)
//         .option("-s, --svelte", "Use Svelte", false)
//         .option("-i, --interactive", "Enable interactive mode", false)
//         .addOption(
//             new Option("-c, --css <css>", "Choose a css framework")
//                 .choices(["tailwind", "bootstrap", "null"])
//                 .default("null"))
//         .addOption(
//             new Option("-m, --manager <manager>", "Choose a package manager")
//                 .choices(["yarn", "npm", "bun"])
//                 .default("npm"))
//         .addOption(
//             new Option("-u, --ui <manager>", "Choose a UI framework")
//                 .choices(["Shadcn", "SkeletonUI", "DaisyUI", "none"])
//                 .default("none"))
//         .action(async (options: reactOptions) => {
//             if (options.interactive) {
//                 options = await SveltePrompts();
//                 options.css = await UIPrompts();
//                 options.manager = await ManagerPrompts();
//             }

//             const projectPath = path.join(process.cwd(), options.name);

//             if (fs.existsSync(projectPath)) {
//                 console.error(`Project folder ${options.name} already exists!`);
//                 process.exit(1);
//             }

//             await CreateSvelte(options);

//             process.chdir(projectPath);

//             if (options.css === "tailwind") {
//                 await GenerateTailwind(options.manager);
//             }
//         });

// }

import { execa } from "execa";
import { Write } from "../../utils/file.js";
import { GenerateTailwind, WriteTailwindPostcss } from "../tailwind/index.js";

const DEPENDENCIES: string[] = ["daisyui"]
const DEV_DEPENDENCIES: string[] = []

export async function GenerateDaisyUI(packageManager: string | undefined, typescript: boolean | undefined) {
    WriteTailwindPostcss();

    await GenerateTailwind(packageManager, typescript);
    await DaisyUIDependencies(packageManager);

    Write("./tailwind.config.ts", TailwindConfig());
}

async function DaisyUIDependencies(packageManager: string | undefined) {

    if (packageManager === "npm") {
        if (DEPENDENCIES.length > 0)
            await execa("npm", ["install"].concat(DEPENDENCIES));
        if (DEV_DEPENDENCIES.length > 0)

            await execa("npm", ["install", "-D"].concat(DEV_DEPENDENCIES));
    } else if (packageManager === "yarn") {
        if (DEPENDENCIES.length > 0)
            await execa("yarn", ["add"].concat(DEPENDENCIES));

        if (DEV_DEPENDENCIES.length > 0)
            await execa("yarn", ["add"].concat(DEV_DEPENDENCIES).concat(["-D"]));
    }
}
function TailwindConfig() {
    return `/** @type {import('tailwindcss').Config} */
export default {
 content: ['./src/**/*.{html,svelte,js,ts}'],
 theme: {
   extend: {},
 },
 plugins: [require('daisyui')],
}`
};


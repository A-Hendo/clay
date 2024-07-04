import { WriteTailwindcss, WriteTailwindPostcss } from "../../../ui/tailwind/index.js";
import { Write } from "../../../utils/file.js";
import { SvelteKit } from "../index.js";


export class SvelteKitDaisyUI extends SvelteKit {

    constructor (
        name: string,
        template: "default" | "skeleton" | "skeletonlib",
        packageManager: string,
        typescript: boolean,
        types: "typescript" | "checkjs" | null,
        prettier: boolean,
        eslint: boolean,
        playwright: boolean,
        vitest: boolean,
        svelte5: boolean | undefined,
    ) {
        super(
            name,
            template,
            packageManager,
            typescript,
            types,
            prettier,
            eslint,
            playwright,
            vitest,
            svelte5,
        );

        this.dependencies.push("daisyui");
        this.devDependencies = this.devDependencies.concat(["tailwindcss", "postcss", "autoprefixer"]);
    }

    async Create() {

        await this.CreateSvelteKit();
        await this.InstallDependencies();

        WriteTailwindcss();
        WriteTailwindPostcss();
        this.WriteTailwindConfig();
    }

    WriteTailwindConfig() {
        const data = `/** @type {import('tailwindcss').Config} */
export default {
 content: ['./src/**/*.{html,svelte,js,ts}'],
 theme: {
   extend: {},
 },
 plugins: [require('daisyui')],
}`
        Write(`./tailwind.config.${this.typescript ? "ts" : "js"}`, data);
    }
};

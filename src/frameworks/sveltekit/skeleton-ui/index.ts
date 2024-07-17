import { WriteTailwindcss, WriteTailwindPostcss } from "../../../ui/tailwind/index.js";
import { Edit, Write } from "../../../utils/file.js";
import { SvelteKit } from "../index.js";


export class SkeletonUI extends SvelteKit {

    constructor (
        name: string,
        template: string,
        packageManager: string,
        typescript: boolean,
        types: string | null,
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

        this.devDependencies = this.devDependencies.concat([
            "@skeletonlabs/skeleton", "@skeletonlabs/tw-plugin", "tailwindcss", "postcss", "autoprefixer"
        ]);

        if (this.typescript)
            this.devDependencies.push("@types/node");
    }

    async Create() {

        await this.CreateSvelteKit();
        await this.InstallDependencies();

        WriteTailwindcss();
        WriteTailwindPostcss();
        this.WriteTailwindConfig();
        this.AddBodyTheme();
    }

    AddBodyTheme() {
        Edit(`./src/app.html`, (content) => {
            return content.replace(
                `<body data-sveltekit-preload-data="hover">`,
                `<body data-sveltekit-preload-data="hover" data-theme="skeleton">`
            );
        });
    }

    WriteTailwindConfig() {
        const data = `import { join } from 'path';
    import type { Config } from 'tailwindcss';

    // 1. Import the Skeleton plugin
    import { skeleton } from '@skeletonlabs/tw-plugin';

    const config = {
        // 2. Opt for dark mode to be handled via the class method
        darkMode: 'class',
        content: [
            './src/**/*.{html,js,svelte,ts}',
            // 3. Append the path to the Skeleton package
            join(require.resolve(
                '@skeletonlabs/skeleton'),
                '../**/*.{html,js,svelte,ts}'
            )
        ],
        theme: {
            extend: {},
        },
        plugins: [
            // 4. Append the Skeleton plugin (after other plugins)
            skeleton({
                themes: {
                    // Register each theme within this array:
                    preset: [ "skeleton" ]
                }
            })
        ]
    } satisfies Config;

    export default config;
    `

        Write(`./tailwind.config.${this.typescript ? "ts" : "js"}`, data);
    };

};

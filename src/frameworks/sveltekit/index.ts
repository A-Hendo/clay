
import { create } from "create-svelte";
import { execa } from "execa";
import * as path from "path";
import { Write } from "../../utils/file.js";
import { Base } from "../index.js";


export class SvelteKit extends Base {
    template: string;
    types: string | null;
    prettier: boolean;
    eslint: boolean;
    playwright: boolean;
    vitest: boolean;
    svelte5: boolean | undefined;

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

        super(name, template, packageManager, typescript);
        this.template = template;
        this.types = types;
        this.prettier = prettier;
        this.eslint = eslint;
        this.playwright = playwright;
        this.vitest = vitest;
        this.svelte5 = svelte5;
    }

    WriteSkeletonLayout() {
        const data = `<script lang="ts">
        import "./styles.css";
    </script>

    <slot />
    `;

        Write("./src/routes/+layout.svelte", data);
    };


    async CreateSvelteKit() {
        await create(this.name, {
            name: this.name,
            template: this.template as "default" | "skeleton" | "skeletonlib",
            types: this.types as "typescript" | "checkjs" | null,
            prettier: this.prettier,
            eslint: this.eslint,
            playwright: this.playwright,
            vitest: this.vitest,
            svelte5: this.svelte5
        });

        const projectPath = path.join(process.cwd(), this.name);
        if (process.cwd() !== projectPath)
            process.chdir(projectPath);

        if (this.template === "skeleton") {
            WriteSkeletonLayout();
        }
    }
}



export async function CreateSvelte(name: string, packageManager: string | undefined) {
    if (packageManager === "npm") {
        await execa("npm", ["create", "vite@latest", name, "--", "--template", "svelte"]);
    } else if (packageManager === "yarn") {
        await execa("yarn", ["create", "vite", name, "--template", "svelte"]);
    } else if (packageManager === "bun") {
        await execa("bun", ["create", "vite", name, "--template", "svelte"]);
    }

    const projectPath = path.join(process.cwd(), name);

    if (process.cwd() !== projectPath)
        process.chdir(projectPath);

}

function WriteSkeletonLayout() {
    const data = `<script lang="ts">
    import "./styles.css";
</script>

<slot />
`;

    Write("./src/routes/+layout.svelte", data);
};

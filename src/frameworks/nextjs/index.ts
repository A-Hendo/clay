import { execa } from "execa";
import * as path from "path";
import { Base } from "../index.js";

export class Nextjs extends Base {
    router: boolean;
    alias: string;
    eslint: boolean;
    srcDir: boolean;

    constructor (
        name: string,
        packageManager: string,
        typescript: boolean,
        router: boolean,
        alias: string,
        eslint: boolean,
        srcDir: boolean,
    ) {
        super(name, packageManager, typescript);
        this.router = router;
        this.alias = alias;
        this.eslint = eslint;
        this.srcDir = srcDir;
    }

    async CreateNextjs() {
        const args = [this.name, "--tailwind"];

        this.typescript ? args.push("--ts") : args.push("--js");

        if (this.router)
            args.push("--app");
        else
            args.push("--no-app");

        args.push("--import-alias");
        args.push(this.alias);

        if (this.eslint)
            args.push("--eslint");
        else
            args.push("--no-eslint");

        if (this.srcDir)
            args.push("--src-dir");
        else
            args.push("--no-src-dir");

        if (this.packageManager === "npm") {
            args.push("--use-npm");
        }
        else if (this.packageManager === "yarn") {
            args.push("--use-yarn");
            await execa("yarn", ["create", "next-app"].concat(args));
        }
        else if (this.packageManager === "pnpm") {
            args.push("--use-pnpm");
            await execa("pnpm", ["create", "next-app"].concat(args));
        }
        else if (this.packageManager === "bun") {
            args.push("--use-bun");
            await execa("bun", ["create-next-app"].concat(args));
        }

        const projectPath = path.join(process.cwd(), this.name);

        if (process.cwd() !== projectPath)
            process.chdir(projectPath);
    }
};

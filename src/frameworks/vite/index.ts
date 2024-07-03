import { execa } from "execa";
import * as path from "path";
import { Base } from "../index.js";

export class Vite extends Base {
    async CreateVite() {
        if (this.packageManager === "npm") {
            await execa("npm", ["create", "vite@latest", this.name, "--", "--template", this.template]);
        } else if (this.packageManager === "yarn") {
            await execa("yarn", ["create", "vite", this.name, "--template", this.template]);
        } else if (this.packageManager === "bun") {
            await execa("bun", ["create", "vite", this.name, "--template", this.template]);
        }

        const projectPath = path.join(process.cwd(), this.name);

        if (process.cwd() !== projectPath)
            process.chdir(projectPath);
    };
}

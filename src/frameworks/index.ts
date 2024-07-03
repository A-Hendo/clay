import { execa } from "execa";

interface IBase {
    name: string;
    template: string;
    typescript: boolean;
    packageManager: string;
    dependencies: string[];
    devDependencies: string[];

    InstallPackages(): Promise<void>;
    Create(): Promise<void>;
}

export class Base implements IBase {
    name: string;
    template: string;
    packageManager: string;
    typescript: boolean;
    dependencies: string[] = [];
    devDependencies: string[] = [];

    constructor (name: string, template: string, packageManager: string, typescript: boolean) {
        this.name = name;
        this.template = template;
        this.packageManager = packageManager;
        this.typescript = typescript;
    }

    async Create() {
        console.error("Cannot create a new project from the base class, use a subclass instead.");
    }

    async InstallPackages() {
        if (this.packageManager === "npm") {
            await execa("npm", ["install"].concat(this.dependencies));
            await execa("npm", ["install", "-D"].concat(this.devDependencies));
        } else if (this.packageManager === "yarn") {
            await execa("yarn", ["add"].concat(this.dependencies));
            await execa("yarn", ["add"].concat(this.devDependencies).concat(["-D"]));
        }
    }
};
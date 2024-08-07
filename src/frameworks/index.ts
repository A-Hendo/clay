import { execa } from "execa";

interface IBase {
    name: string;
    typescript: boolean;
    packageManager: string;
    dependencies: string[];
    devDependencies: string[];

    InstallDependencies(): Promise<void>;
    Create(): Promise<void>;
}

export class Base implements IBase {
    name: string;
    packageManager: string;
    typescript: boolean;
    dependencies: string[] = [];
    devDependencies: string[] = [];

    constructor (name: string, packageManager: string, typescript: boolean) {
        this.name = name;
        this.packageManager = packageManager;
        this.typescript = typescript;
    }

    async Create() {
        console.error("Cannot create a new project, selection may not be implemented");
    }

    async InstallDependencies() {
        if (this.packageManager === "npm") {
            if (this.dependencies.length > 0)
                await execa("npm", ["install"].concat(this.dependencies));
            if (this.devDependencies.length > 0)
                await execa("npm", ["install", "-D"].concat(this.devDependencies));
            await execa("npm")
        } else if (this.packageManager === "yarn") {
            if (this.dependencies.length > 0)
                await execa("yarn", ["add"].concat(this.dependencies));
            if (this.devDependencies.length > 0)
                await execa("yarn", ["add"].concat(this.devDependencies).concat(["-D"]));
            await execa("yarn")
        }
    }
};

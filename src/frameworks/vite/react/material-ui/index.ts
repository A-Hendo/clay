import { Vite } from "../../index.js";

export class ReactMUI extends Vite {
    constructor (
        name: string,
        template: string,
        packageManager: string,
        typescript: boolean,
    ) {
        super(name, template, packageManager, typescript);


        this.dependencies = this.dependencies.concat(
            ["@mui/material", "@emotion/react", "@emotion/styled", "@mui/icons-material"]
        );
        // this.devDependencies = this.devDependencies.concat(["tailwindcss", "postcss", "autoprefixer"]);
    }

    async Create() {
        await this.CreateVite();
        await this.InstallDependencies();
    }
};

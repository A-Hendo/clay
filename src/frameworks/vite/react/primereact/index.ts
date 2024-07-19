import { Append, Write } from "../../../../utils/file.js";
import { Vite } from "../../index.js";

export class PrimeReact extends Vite {
    constructor (
        name: string,
        template: string,
        packageManager: string,
        typescript: boolean,
    ) {
        super(name, template, packageManager, typescript);


        this.dependencies = this.dependencies.concat(["primereact", "primeicons", "primeflex"]);
    }

    async Create() {
        await this.CreateVite();
        await this.InstallDependencies();

        this.WriteMainFile();
        this.AppendAppCss();
    }

    WriteMainFile() {
        const data = `import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from "primereact/api";
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PrimeReactProvider>
       <App />
    </PrimeReactProvider>
  </React.StrictMode>
)
`

        Write(`./src/main.${this.typescript ? "tsx" : "jsx"}`, data);
    }

    AppendAppCss() {
        const data = `import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex

`
        Append(`./src/App.${this.typescript ? "tsx" : "jsx"}`, data);
    }
};

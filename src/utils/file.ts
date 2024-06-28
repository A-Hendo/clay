import * as fs from "fs";

export function Append(file: string, content: string) {
    const css = fs.readFileSync(file, "utf8");
    const newContent = `${content}\n\n${css}`;

    fs.writeFile(file, newContent, (err) => {
        if (err) throw err;
    });
};

export function Write(file: string, content: string) {
    fs.writeFile(file, content, (err) => {
        if (err) throw err;
    });
};

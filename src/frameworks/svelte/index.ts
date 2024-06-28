
import { create } from "create-svelte";
import { type Options } from "create-svelte/types/internal.js";
import * as path from "path";
import { Write } from "../../utils/file.js";


export async function CreateSvelte(options: Options) {
    await create(options.name, options);

    const projectPath = path.join(process.cwd(), options.name);

    if (options.template === "skeleton") {
        process.chdir(projectPath);
        WriteSkeletonLayout();
    }
}

function WriteSkeletonLayout() {
    const data = `<script lang="ts">
    import "./styles.css";
</script>

<slot />
`;

    Write("./src/routes/+layout.svelte", data);
};

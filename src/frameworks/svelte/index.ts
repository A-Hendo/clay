
import { create } from "create-svelte";
import { type Options } from "create-svelte/types/internal.js";


export async function CreateSvelte(options: Options) {
    await create(options.name, options);
}
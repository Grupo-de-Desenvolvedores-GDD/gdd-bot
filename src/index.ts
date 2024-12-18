import { bootstrapApp } from "#base"
import { clearExpireds } from "cache/teleports.js"

await bootstrapApp({
    workdir: import.meta.dirname,
    whenReady() {
        clearExpireds()
    },
})
import { z } from "zod"

const envSchema = z.object({ TOKEN: z.string({ description: "Discord Bot Token is required" }).min(1), })

type EnvSchema = z.infer<typeof envSchema>

export { envSchema, type EnvSchema }
import * as z from "zod";

export const emailSchema = z.email({ error: "Неверный email" });

export type Email = z.infer<typeof emailSchema>;
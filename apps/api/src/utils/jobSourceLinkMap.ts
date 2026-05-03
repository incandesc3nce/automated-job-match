export const jobSourceLinkMap: Record<string, (externalId: string) => string> = {
  hh: (externalId: string) => `https://hh.ru/vacancy/${externalId}`,
} as const;

export type JobSource = keyof typeof jobSourceLinkMap;

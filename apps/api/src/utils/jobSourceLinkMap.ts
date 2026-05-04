export const jobSourceLinkMap: Record<string, (externalId: string) => string> = {
  hh: (externalId: string) => `https://hh.ru/vacancy/${externalId}`,
  getmatch: (externalId: string) => `https://getmatch.ru/vacancies/${externalId}`,
} as const;

export type JobSource = keyof typeof jobSourceLinkMap;

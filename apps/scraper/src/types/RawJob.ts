export type RawJob = {
  id: string;
  title: string;
  experience: string;
  location: string | null;
  companyName: string;
  workFormat: string | null;
  salaryFrom: string | null;
  salaryTo: string | null;
  salaryExtra: string | null;
  description: string;
  skills: string[];
  postedAt: Date | null;
};

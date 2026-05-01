export type RawJob = {
  id: string;
  title: string;
  experience: string;
  location: string;
  companyName: string;
  workFormat: string;
  salaryFrom: string | null;
  salaryTo: string | null;
  salaryExtra: string | null;
  description: string;
  skills: string[];
  postedAt: Date | null;
};

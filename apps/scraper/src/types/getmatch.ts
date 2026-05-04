export type GetMatchOffer = {
  id: number;
  is_active: boolean;
  position: string; // title
  company: {
    id: string | number | null;
    name: string; // companyName
  };
  location_requirements: {
    // combine "city, country" into location string 
    city: string | null;
    country: string | null;
    exclude: boolean;
    format: 'office' | 'hybrid' | 'remote' | 'relocation_company'; // workFormat, join multiple entries if there are multiple formats
    location_id: string;
  }[];
  location_items: {
    exclude: boolean;
    format: string;
    label: string;
  }[];
  stack: string[]; // skills
  published_at: string; // postedAt, convert to Date
  language: string;
  type: string;
  url: string;
  salary_description: string;
} & (
  | {
      salary_hidden: true;
      salary_display_from: null;
      salary_display_to: null;
    }
  | {
      salary_hidden: false;
      salary_display_from: number;
      salary_display_to: number;
    }
);

export type GetMatchPageRes = {
  meta: {
    total: number;
    offset: number;
    limit: number;
  };
  offers: GetMatchOffer[];
  current_filters: null;
  profile_filters: null;
};

export type GetMatchOfferDetails = GetMatchOffer & {
  seniority: string | null;
  required_years_of_experience: number | null;
  offer_description: string;
  description: string;
}

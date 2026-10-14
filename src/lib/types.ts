export type Stream = "Engineering" | "Management" | "Medical" | "Law" | "Commerce";
export type Ownership = "Government" | "Private";
export type Zone = "North" | "South" | "East" | "West";
export type CutoffUnit = "rank" | "pct" | "score";
export type Tone = "neutral" | "blue" | "green" | "red" | "amber";

export interface Programme {
  label: string;
  /** Course key used for filtering, e.g. "B.Tech". */
  course: CourseKey;
  feePerYear: number;
  durationYears: number;
  intake: number;
}

export interface Cutoff {
  exam: ExamKey;
  /** General-category closing value. */
  close: number;
  unit: CutoffUnit;
}

export interface College {
  slug: string;
  name: string;
  fullName: string;
  short: string;
  city: string;
  state: string;
  established: number;
  ownership: Ownership;
  stream: Stream;
  nirf: number;
  rating: number;
  ratingCount: number;
  highestLpa: number | null;
  averageLpa: number | null;
  placedPct: number | null;
  programmes: Programme[];
  cutoff: Cutoff | null;
  recruiters: string[];
  sponsored?: boolean;
  /** ISO date of the last verified data update — shown on every page for trust. */
  updatedAt: string;
  source: string;
}

export type CourseKey =
  | "B.Tech" | "M.Tech" | "MBA" | "BBA" | "MBBS" | "B.Sc Nursing"
  | "BA LLB" | "LLM" | "B.Com" | "BA";

export interface Course {
  key: CourseKey;
  slug: string;
  fullName: string;
  duration: string;
  stream: Stream;
  collegeCount: number;
}

export type ExamKey =
  | "JEE Main" | "JEE Advanced" | "NEET UG" | "CAT" | "CUET UG" | "CLAT"
  | "BITSAT" | "VITEEE" | "WBJEE" | "MET";

export interface Exam {
  key: ExamKey;
  fullName: string;
  conductedBy: string;
  date: string;
  unit: CutoffUnit;
  acceptedBy: number;
}

export interface Deadline {
  title: string;
  by: string;
  date: string;
  exam: ExamKey;
}

export interface NewsItem {
  slug: string;
  category: string;
  title: string;
  date: string;
  live?: boolean;
}

export interface Scholarship {
  name: string;
  by: string;
  amount: string;
  per: string;
  eligibility: string;
}

export type FeeBand = "lt1" | "1-2" | "2-3" | "3-5" | "5p";
export type SortKey = "rank" | "roi" | "rating" | "package" | "fee";

/** Canonical listing filters — the single source of truth for URLs, queries and UI. */
export interface CollegeFilters {
  course?: CourseKey;
  stream?: Stream;
  city?: string;
  state?: string;
  ownership?: Ownership;
  fee?: FeeBand;
  minPackage?: number;
  minRating?: number;
  q?: string;
  sort: SortKey;
  page: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type Chance = "safe" | "likely" | "reach";
export type Category = "General" | "EWS" | "OBC" | "SC" | "ST";

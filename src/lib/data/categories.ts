/**
 * SAMPLE DATA — illustrative only.
 * Top-level categories for the header menu and /category pages. Each has four sections:
 * courses, college / exam application forms, counselling and colleges.
 * Entries that match a college or course in sample.ts link to its real page;
 * the rest point at their section on the category page until those pages exist.
 */
import { collegesHref } from "../filters";
import type { CourseKey } from "../types";
import { COLLEGES, COURSES } from "./sample";

export interface CategoryItem { label: string; note?: string; href?: string }

export interface Category {
  slug: string;
  label: string;
  description: string;
  counselling: CategoryItem[];
  colleges: CategoryItem[];
  courses: CategoryItem[];
  forms: CategoryItem[];
}

export const CATEGORY_SECTIONS = [
  { key: "courses", id: "courses", title: "Courses" },
  { key: "forms", id: "application-forms", title: "College & exam application forms" },
  { key: "counselling", id: "counselling", title: "Counselling" },
  { key: "colleges", id: "colleges", title: "Colleges" },
] as const;

const item = (label: string, note?: string): CategoryItem => ({ label, note });

function college(slug: string): CategoryItem {
  const c = COLLEGES.find((x) => x.slug === slug);
  if (!c) throw new Error(`Unknown college slug in categories: ${slug}`);
  return { label: c.name, note: c.city, href: `/college/${c.slug}` };
}

function course(key: CourseKey): CategoryItem {
  const c = COURSES.find((x) => x.key === key);
  if (!c) throw new Error(`Unknown course in categories: ${key}`);
  return { label: c.key, note: c.fullName, href: collegesHref({ course: c.key }) };
}

export const CATEGORIES: Category[] = [
  {
    slug: "engineering-technology",
    label: "Engineering & Technology",
    description: "Engineering entrance exams, counselling rounds, colleges and courses in one place.",
    counselling: [item("JoSAA", "IITs, NITs, IIITs and GFTIs"), item("CSAB", "Special rounds for NITs and GFTIs"), item("MHT CET CAP", "Maharashtra"), item("WBJEE counselling", "West Bengal"), item("KCET counselling", "Karnataka"), item("COMEDK UGET counselling", "Karnataka private colleges")],
    colleges: [college("iit-madras"), college("iit-delhi"), college("iit-bombay"), college("nit-trichy"), college("bits-pilani"), college("iiit-hyderabad")],
    courses: [course("B.Tech"), course("M.Tech"), item("B.Arch", "Bachelor of Architecture"), item("Polytechnic diploma", "Diploma in Engineering")],
    forms: [item("JEE Main", "NTA"), item("JEE Advanced", "IITs"), item("BITSAT", "BITS Pilani"), item("VITEEE", "VIT"), item("MHT CET", "Maharashtra CET Cell"), item("WBJEE", "WBJEEB")],
  },
  {
    slug: "management-mba",
    label: "Management & MBA",
    description: "MBA and BBA entrance exams, admission rounds and top business schools.",
    counselling: [item("IIM Common Admission Process", "Participating IIMs"), item("MAH MBA CET CAP", "Maharashtra"), item("TANCET MBA counselling", "Tamil Nadu"), item("CMAT counselling", "AICTE-approved colleges")],
    colleges: [college("iim-ahmedabad"), college("iim-bangalore"), college("fms-delhi")],
    courses: [course("MBA"), course("BBA"), item("PGDM", "Post Graduate Diploma in Management"), item("Executive MBA", "For working professionals")],
    forms: [item("CAT", "IIMs"), item("XAT", "XLRI"), item("CMAT", "NTA"), item("SNAP", "Symbiosis"), item("NMAT", "GMAC"), item("IPMAT", "IIM Indore")],
  },
  {
    slug: "medicine-healthcare",
    label: "Medicine & Healthcare",
    description: "NEET, medical counselling and colleges for MBBS, nursing and allied health.",
    counselling: [item("MCC NEET UG counselling", "All-India quota seats"), item("MCC NEET PG counselling", "All-India quota seats"), item("State quota counselling", "State medical seats"), item("AACCC counselling", "AYUSH courses")],
    colleges: [college("aiims-delhi"), college("cmc-vellore")],
    courses: [course("MBBS"), course("B.Sc Nursing"), item("BDS", "Bachelor of Dental Surgery"), item("BAMS", "Bachelor of Ayurvedic Medicine & Surgery"), item("B.Pharm", "Bachelor of Pharmacy")],
    forms: [item("NEET UG", "NTA"), item("NEET PG", "NBEMS"), item("INI CET", "AIIMS New Delhi")],
  },
  {
    slug: "law",
    label: "Law",
    description: "Law entrance exams, NLU counselling, law schools and courses.",
    counselling: [item("CLAT counselling", "Consortium of NLUs"), item("AILET admissions", "NLU Delhi"), item("MH CET Law CAP", "Maharashtra")],
    colleges: [college("nlsiu")],
    courses: [course("BA LLB"), course("LLM"), item("LLB (3 years)", "After graduation")],
    forms: [item("CLAT", "Consortium of NLUs"), item("AILET", "NLU Delhi"), item("LSAT India"), item("MH CET Law", "Maharashtra CET Cell")],
  },
  {
    slug: "government-jobs-civil-services",
    label: "Government Jobs & Civil Services",
    description: "Civil services and government recruitment exams, with guidance at each stage.",
    counselling: [item("UPSC civil services guidance", "Prelims, mains and interview"), item("State PSC guidance"), item("SSC exam guidance")],
    colleges: [item("LBSNAA, Mussoorie", "Training academy for civil services"), item("Indian Institute of Public Administration", "New Delhi")],
    courses: [course("BA"), item("Public Administration"), item("Political Science")],
    forms: [item("UPSC Civil Services", "UPSC"), item("UPSC CAPF", "UPSC"), item("SSC CGL", "SSC"), item("SSC CHSL", "SSC"), item("State PSC exams")],
  },
  {
    slug: "banking-insurance",
    label: "Banking & Insurance",
    description: "Bank and insurance recruitment exams, training institutes and related courses.",
    counselling: [item("IBPS recruitment guidance", "PO, Clerk and SO"), item("SBI PO interview guidance"), item("RBI Grade B guidance")],
    colleges: [item("NIBM Pune", "National Institute of Bank Management"), item("IIBF Mumbai", "Indian Institute of Banking & Finance"), item("National Insurance Academy", "Pune")],
    courses: [course("B.Com"), item("BBA in Banking & Insurance"), item("PG Diploma in Banking"), item("JAIIB / CAIIB", "IIBF")],
    forms: [item("IBPS PO", "IBPS"), item("IBPS Clerk", "IBPS"), item("SBI PO", "SBI"), item("SBI Clerk", "SBI"), item("RBI Grade B", "RBI"), item("LIC AAO", "LIC")],
  },
  {
    slug: "teaching-education",
    label: "Teaching & Education",
    description: "Teacher eligibility tests, B.Ed admissions and education colleges.",
    counselling: [item("B.Ed counselling", "State admission rounds"), item("D.El.Ed counselling", "State admission rounds")],
    colleges: [item("Regional Institutes of Education", "NCERT"), item("Jamia Millia Islamia", "Faculty of Education"), item("Banaras Hindu University", "Faculty of Education")],
    courses: [item("B.Ed", "Bachelor of Education"), item("D.El.Ed", "Diploma in Elementary Education"), item("M.Ed", "Master of Education"), course("BA")],
    forms: [item("CTET", "CBSE"), item("UGC NET", "NTA"), item("State TET exams"), item("KVS recruitment", "Kendriya Vidyalaya Sangathan"), item("NVS recruitment", "Navodaya Vidyalaya Samiti")],
  },
  {
    slug: "commerce-finance-accounting",
    label: "Commerce, Finance & Accounting",
    description: "Commerce colleges, professional courses like CA and CS, and their entrance forms.",
    counselling: [item("DU CSAS (UG)", "Delhi University, via CUET UG"), item("Career guidance for CA, CS and CMA")],
    colleges: [college("srcc"), college("christ")],
    courses: [course("B.Com"), course("BBA"), item("CA", "Chartered Accountancy"), item("CS", "Company Secretary"), item("CMA", "Cost & Management Accountancy")],
    forms: [item("CUET UG", "NTA"), item("CA Foundation", "ICAI"), item("CSEET", "ICSI"), item("CMA Foundation", "ICMAI")],
  },
  {
    slug: "school-university-entrance",
    label: "School & University Entrance",
    description: "School admission tests and central university entrance exams.",
    counselling: [item("DU CSAS (UG)", "Delhi University"), item("Navodaya admissions", "Class 6 and 9"), item("Sainik School admissions", "Class 6 and 9")],
    colleges: [item("Delhi University"), item("Banaras Hindu University"), item("Jawaharlal Nehru University")],
    courses: [course("BA"), course("B.Com"), item("B.Sc", "Bachelor of Science")],
    forms: [item("CUET UG", "NTA"), item("CUET PG", "NTA"), item("JNVST", "Navodaya Vidyalaya Samiti"), item("AISSEE", "NTA, for Sainik Schools")],
  },
  {
    slug: "railways-psu",
    label: "Railways & PSU",
    description: "Railway recruitment exams and PSU jobs, including recruitment through GATE.",
    counselling: [item("RRB document verification guidance"), item("PSU recruitment through GATE")],
    colleges: [item("National Academy of Indian Railways", "Vadodara"), item("IRICEN", "Pune")],
    courses: [course("B.Tech"), item("Polytechnic diploma", "Diploma in Engineering"), item("ITI", "Industrial Training Institute trades")],
    forms: [item("RRB NTPC", "RRBs"), item("RRB ALP", "RRBs"), item("RRB JE", "RRBs"), item("RRB Group D", "RRBs"), item("GATE", "IITs and IISc")],
  },
  {
    slug: "defence-police",
    label: "Defence & Police",
    description: "Defence and police entrance exams, SSB guidance and training academies.",
    counselling: [item("SSB interview guidance", "Army and Navy"), item("AFSB interview guidance", "Air Force")],
    colleges: [item("National Defence Academy", "Khadakwasla, Pune"), item("Indian Military Academy", "Dehradun"), item("Officers Training Academy", "Chennai"), item("SVP National Police Academy", "Hyderabad")],
    courses: [item("NDA programme", "BA, B.Sc and B.Tech streams"), course("B.Tech")],
    forms: [item("NDA & NA", "UPSC"), item("CDS", "UPSC"), item("AFCAT", "Indian Air Force"), item("Agniveer", "Army, Navy and Air Force"), item("SSC GD Constable", "SSC"), item("UPSC CAPF", "UPSC")],
  },
];

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

/** Where an item goes: its own page if one exists, otherwise its section on the category page. */
export const itemHref = (cat: Category, section: (typeof CATEGORY_SECTIONS)[number], it: CategoryItem) =>
  it.href ?? `/category/${cat.slug}#${section.id}`;

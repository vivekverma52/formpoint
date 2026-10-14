/**
 * SAMPLE DATA — illustrative only.
 * College records are read only through `src/lib/api.ts`; point that at the real API to go live.
 * Small reference lists (courses, cities, streams) are also imported directly by filters and forms;
 * move those to a `/reference` endpoint (or keep them static) when the API lands.
 */
import type { College, Course, CourseKey, Deadline, Exam, NewsItem, Programme, Scholarship, Stream } from "../types";

type ProgTemplate = [label: string, course: CourseKey, feeFactor: number, years: number, intake: number];
const PROGRAMME_TEMPLATES: Record<string, ProgTemplate[]> = {
  Engineering: [
    ["B.Tech – Computer Science", "B.Tech", 1, 4, 120],
    ["B.Tech – Electrical", "B.Tech", 1, 4, 90],
    ["B.Tech – Mechanical", "B.Tech", 1, 4, 90],
    ["B.Tech – Civil", "B.Tech", 1, 4, 60],
    ["M.Tech", "M.Tech", 0.85, 2, 60],
  ],
  Management: [["MBA / PGP", "MBA", 1, 2, 400], ["Executive MBA", "MBA", 1.4, 1, 80]],
  UGManagement: [["BBA", "BBA", 1, 3, 180]],
  Medical: [["MBBS", "MBBS", 1, 5.5, 125], ["B.Sc Nursing", "B.Sc Nursing", 0.6, 4, 60]],
  Law: [["BA LLB (Hons)", "BA LLB", 1, 5, 120], ["LLM", "LLM", 0.8, 1, 50]],
  Commerce: [["B.Com (Hons)", "B.Com", 1, 3, 300], ["BA (Hons)", "BA", 0.8, 3, 240]],
};

function programmes(groups: [string, number][]): Programme[] {
  return groups.flatMap(([group, base]) =>
    (PROGRAMME_TEMPLATES[group] ?? []).map(([label, course, f, years, intake]) => ({
      label, course, feePerYear: Math.round((base * f) / 100) * 100, durationYears: years, intake,
    })),
  );
}

type Raw = Omit<College, "programmes" | "updatedAt" | "source"> & { prog: [string, number][] };
const raw: Raw[] = [
  { slug: "iit-madras", name: "IIT Madras", fullName: "IIT Madras – Indian Institute of Technology", short: "IITM", city: "Chennai", state: "Tamil Nadu", established: 1959, ownership: "Government", stream: "Engineering", nirf: 1, rating: 4.3, ratingCount: 1240, highestLpa: 198, averageLpa: 24, placedPct: 92, prog: [["Engineering", 229000]], cutoff: { exam: "JEE Advanced", close: 160, unit: "rank" }, recruiters: ["Google", "Microsoft", "Qualcomm", "Goldman Sachs", "Texas Instruments", "Uber"] },
  { slug: "iit-delhi", name: "IIT Delhi", fullName: "IIT Delhi – Indian Institute of Technology", short: "IITD", city: "New Delhi", state: "Delhi", established: 1961, ownership: "Government", stream: "Engineering", nirf: 2, rating: 4.2, ratingCount: 980, highestLpa: 102, averageLpa: 25.8, placedPct: 90, prog: [["Engineering", 228000]], cutoff: { exam: "JEE Advanced", close: 115, unit: "rank" }, recruiters: ["Google", "Apple", "Microsoft", "Flipkart", "Tower Research", "Adobe"] },
  { slug: "iit-bombay", name: "IIT Bombay", fullName: "IIT Bombay – Indian Institute of Technology", short: "IITB", city: "Mumbai", state: "Maharashtra", established: 1958, ownership: "Government", stream: "Engineering", nirf: 3, rating: 4.4, ratingCount: 1410, highestLpa: 220, averageLpa: 21.6, placedPct: 91, prog: [["Engineering", 230000]], cutoff: { exam: "JEE Advanced", close: 66, unit: "rank" }, recruiters: ["Jane Street", "Google", "Samsung", "Optiver", "Microsoft", "ITC"] },
  { slug: "iit-kanpur", name: "IIT Kanpur", fullName: "IIT Kanpur – Indian Institute of Technology", short: "IITK", city: "Kanpur", state: "Uttar Pradesh", established: 1959, ownership: "Government", stream: "Engineering", nirf: 4, rating: 4.3, ratingCount: 860, highestLpa: 190, averageLpa: 16.5, placedPct: 88, prog: [["Engineering", 222000]], cutoff: { exam: "JEE Advanced", close: 240, unit: "rank" }, recruiters: ["Microsoft", "Oracle", "Goldman Sachs", "Intel", "Uber", "Rubrik"] },
  { slug: "iit-kharagpur", name: "IIT Kharagpur", fullName: "IIT Kharagpur – Indian Institute of Technology", short: "IITKGP", city: "Kharagpur", state: "West Bengal", established: 1951, ownership: "Government", stream: "Engineering", nirf: 5, rating: 4.2, ratingCount: 1120, highestLpa: 260, averageLpa: 18.2, placedPct: 87, prog: [["Engineering", 222000]], cutoff: { exam: "JEE Advanced", close: 420, unit: "rank" }, recruiters: ["Google", "Amazon", "Tata Steel", "Schlumberger", "Qualcomm", "JP Morgan"] },
  { slug: "nit-trichy", name: "NIT Trichy", fullName: "NIT Trichy – National Institute of Technology", short: "NITT", city: "Tiruchirappalli", state: "Tamil Nadu", established: 1964, ownership: "Government", stream: "Engineering", nirf: 9, rating: 4.0, ratingCount: 640, highestLpa: 55.4, averageLpa: 14.4, placedPct: 89, prog: [["Engineering", 160000]], cutoff: { exam: "JEE Main", close: 1400, unit: "rank" }, recruiters: ["Amazon", "Walmart", "Bosch", "Mercedes-Benz R&D", "ZS", "Siemens"] },
  { slug: "iiit-hyderabad", name: "IIIT Hyderabad", fullName: "International Institute of Information Technology, Hyderabad", short: "IIITH", city: "Hyderabad", state: "Telangana", established: 1998, ownership: "Private", stream: "Engineering", nirf: 47, rating: 4.5, ratingCount: 410, highestLpa: 74, averageLpa: 32.1, placedPct: 97, prog: [["Engineering", 400000]], cutoff: { exam: "JEE Main", close: 2600, unit: "rank" }, recruiters: ["Google", "Microsoft", "Nvidia", "Atlassian", "DE Shaw", "Salesforce"] },
  { slug: "dtu", name: "Delhi Technological University", fullName: "Delhi Technological University (DTU)", short: "DTU", city: "New Delhi", state: "Delhi", established: 1941, ownership: "Government", stream: "Engineering", nirf: 27, rating: 4.2, ratingCount: 920, highestLpa: 82, averageLpa: 15.1, placedPct: 85, prog: [["Engineering", 219000]], cutoff: { exam: "JEE Main", close: 6800, unit: "rank" }, recruiters: ["Amazon", "Adobe", "Samsung", "Paytm", "Goldman Sachs", "Zomato"] },
  { slug: "bits-pilani", name: "BITS Pilani", fullName: "Birla Institute of Technology and Science, Pilani", short: "BITS", city: "Pilani", state: "Rajasthan", established: 1964, ownership: "Private", stream: "Engineering", nirf: 20, rating: 4.5, ratingCount: 1300, highestLpa: 60.7, averageLpa: 18.4, placedPct: 92, prog: [["Engineering", 540000]], cutoff: { exam: "BITSAT", close: 327, unit: "score" }, recruiters: ["Google", "Microsoft", "Cisco", "Oracle", "Goldman Sachs", "Graviton"] },
  { slug: "vit-vellore", name: "VIT Vellore", fullName: "Vellore Institute of Technology", short: "VIT", city: "Vellore", state: "Tamil Nadu", established: 1984, ownership: "Private", stream: "Engineering", nirf: 11, rating: 3.9, ratingCount: 2100, highestLpa: 102, averageLpa: 9.9, placedPct: 82, prog: [["Engineering", 390000]], cutoff: { exam: "VITEEE", close: 9000, unit: "rank" }, recruiters: ["TCS", "Accenture", "PayPal", "Microsoft", "Cognizant", "Wipro"], sponsored: true },
  { slug: "jadavpur", name: "Jadavpur University", fullName: "Jadavpur University, Kolkata", short: "JU", city: "Kolkata", state: "West Bengal", established: 1955, ownership: "Government", stream: "Engineering", nirf: 12, rating: 4.4, ratingCount: 690, highestLpa: 84.4, averageLpa: 15.5, placedPct: 88, prog: [["Engineering", 2400], ["Commerce", 2000]], cutoff: { exam: "WBJEE", close: 120, unit: "rank" }, recruiters: ["Amazon", "Google", "Tata Steel", "ITC", "Deloitte", "Cognizant"] },
  { slug: "chandigarh-university", name: "Chandigarh University", fullName: "Chandigarh University (CU), Mohali", short: "CU", city: "Mohali", state: "Punjab", established: 2012, ownership: "Private", stream: "Engineering", nirf: 32, rating: 3.8, ratingCount: 2600, highestLpa: 54.7, averageLpa: 6.5, placedPct: 78, prog: [["Engineering", 180000], ["UGManagement", 150000], ["Commerce", 90000]], cutoff: null, recruiters: ["Microsoft", "Capgemini", "TCS", "Infosys", "Accenture", "HCL"], sponsored: true },
  { slug: "iim-ahmedabad", name: "IIM Ahmedabad", fullName: "Indian Institute of Management Ahmedabad", short: "IIMA", city: "Ahmedabad", state: "Gujarat", established: 1961, ownership: "Government", stream: "Management", nirf: 1, rating: 4.6, ratingCount: 520, highestLpa: 115, averageLpa: 34.5, placedPct: 100, prog: [["Management", 1250000]], cutoff: { exam: "CAT", close: 99.5, unit: "pct" }, recruiters: ["McKinsey", "BCG", "Bain", "Goldman Sachs", "Accenture Strategy", "Google"] },
  { slug: "iim-bangalore", name: "IIM Bangalore", fullName: "Indian Institute of Management Bangalore", short: "IIMB", city: "Bengaluru", state: "Karnataka", established: 1973, ownership: "Government", stream: "Management", nirf: 2, rating: 4.6, ratingCount: 480, highestLpa: 80, averageLpa: 33.8, placedPct: 100, prog: [["Management", 1225000]], cutoff: { exam: "CAT", close: 99.2, unit: "pct" }, recruiters: ["McKinsey", "BCG", "Amazon", "Microsoft", "Kearney", "Flipkart"] },
  { slug: "fms-delhi", name: "FMS Delhi", fullName: "Faculty of Management Studies, University of Delhi", short: "FMS", city: "New Delhi", state: "Delhi", established: 1954, ownership: "Government", stream: "Management", nirf: 12, rating: 4.6, ratingCount: 300, highestLpa: 61, averageLpa: 32, placedPct: 100, prog: [["Management", 116000]], cutoff: { exam: "CAT", close: 98.9, unit: "pct" }, recruiters: ["BCG", "Bain", "Hindustan Unilever", "Kotak", "Amazon", "Deloitte"] },
  { slug: "aiims-delhi", name: "AIIMS New Delhi", fullName: "All India Institute of Medical Sciences, New Delhi", short: "AIIMS", city: "New Delhi", state: "Delhi", established: 1956, ownership: "Government", stream: "Medical", nirf: 1, rating: 4.8, ratingCount: 640, highestLpa: null, averageLpa: null, placedPct: null, prog: [["Medical", 1628]], cutoff: { exam: "NEET UG", close: 57, unit: "rank" }, recruiters: [] },
  { slug: "cmc-vellore", name: "CMC Vellore", fullName: "Christian Medical College, Vellore", short: "CMC", city: "Vellore", state: "Tamil Nadu", established: 1900, ownership: "Private", stream: "Medical", nirf: 3, rating: 4.7, ratingCount: 380, highestLpa: null, averageLpa: null, placedPct: null, prog: [["Medical", 60000]], cutoff: { exam: "NEET UG", close: 1400, unit: "rank" }, recruiters: [] },
  { slug: "nlsiu", name: "NLSIU Bengaluru", fullName: "National Law School of India University", short: "NLS", city: "Bengaluru", state: "Karnataka", established: 1987, ownership: "Government", stream: "Law", nirf: 1, rating: 4.6, ratingCount: 290, highestLpa: 40, averageLpa: 17, placedPct: 95, prog: [["Law", 360000]], cutoff: { exam: "CLAT", close: 80, unit: "rank" }, recruiters: ["AZB & Partners", "Cyril Amarchand Mangaldas", "Khaitan & Co", "Trilegal", "JSA"] },
  { slug: "christ", name: "Christ University", fullName: "Christ University, Bengaluru", short: "CHRIST", city: "Bengaluru", state: "Karnataka", established: 1969, ownership: "Private", stream: "Commerce", nirf: 60, rating: 3.9, ratingCount: 1800, highestLpa: 25, averageLpa: 6.8, placedPct: 80, prog: [["Commerce", 120000], ["UGManagement", 260000]], cutoff: null, recruiters: ["Deloitte", "EY", "KPMG", "Goldman Sachs", "Amazon", "HSBC"] },
  { slug: "srcc", name: "SRCC Delhi", fullName: "Shri Ram College of Commerce, University of Delhi", short: "SRCC", city: "New Delhi", state: "Delhi", established: 1926, ownership: "Government", stream: "Commerce", nirf: 9, rating: 4.5, ratingCount: 870, highestLpa: 39, averageLpa: 10.5, placedPct: 95, prog: [["Commerce", 30000]], cutoff: { exam: "CUET UG", close: 99.7, unit: "pct" }, recruiters: ["Bain", "EY", "Deloitte", "Goldman Sachs", "KPMG", "Kotak"] },
];

export const COLLEGES: College[] = raw.map(({ prog, ...c }) => ({
  ...c,
  programmes: programmes(prog),
  updatedAt: "2026-09-30",
  source: "Sample data",
}));

export const COURSES: Course[] = [
  { key: "B.Tech", slug: "btech", fullName: "Bachelor of Technology", duration: "4 yrs", stream: "Engineering", collegeCount: 1862 },
  { key: "MBA", slug: "mba", fullName: "Master of Business Administration", duration: "2 yrs", stream: "Management", collegeCount: 991 },
  { key: "MBBS", slug: "mbbs", fullName: "Bachelor of Medicine & Surgery", duration: "5.5 yrs", stream: "Medical", collegeCount: 706 },
  { key: "BBA", slug: "bba", fullName: "Bachelor of Business Administration", duration: "3 yrs", stream: "Management", collegeCount: 422 },
  { key: "BA LLB", slug: "ba-llb", fullName: "Integrated Bachelor of Laws", duration: "5 yrs", stream: "Law", collegeCount: 512 },
  { key: "B.Com", slug: "bcom", fullName: "Bachelor of Commerce", duration: "3 yrs", stream: "Commerce", collegeCount: 2310 },
  { key: "M.Tech", slug: "mtech", fullName: "Master of Technology", duration: "2 yrs", stream: "Engineering", collegeCount: 1140 },
  { key: "B.Sc Nursing", slug: "bsc-nursing", fullName: "Bachelor of Science in Nursing", duration: "4 yrs", stream: "Medical", collegeCount: 1980 },
  { key: "BA", slug: "ba", fullName: "Bachelor of Arts", duration: "3 yrs", stream: "Commerce", collegeCount: 3400 },
  { key: "LLM", slug: "llm", fullName: "Master of Laws", duration: "1 yr", stream: "Law", collegeCount: 310 },
];

export const STREAMS: { key: Stream; label: string; courses: CourseKey[]; collegeCount: number }[] = [
  { key: "Engineering", label: "Engineering", courses: ["B.Tech", "M.Tech"], collegeCount: 6240 },
  { key: "Management", label: "Management", courses: ["MBA", "BBA"], collegeCount: 4810 },
  { key: "Medical", label: "Medical", courses: ["MBBS", "B.Sc Nursing"], collegeCount: 2930 },
  { key: "Law", label: "Law", courses: ["BA LLB", "LLM"], collegeCount: 1180 },
  { key: "Commerce", label: "Commerce & Arts", courses: ["B.Com", "BA"], collegeCount: 9620 },
];

export const CITIES = [
  { name: "New Delhi", slug: "delhi", code: "DL", pin: "110001", count: 412 },
  { name: "Bengaluru", slug: "bengaluru", code: "KA", pin: "560001", count: 386 },
  { name: "Mumbai", slug: "mumbai", code: "MH", pin: "400001", count: 344 },
  { name: "Hyderabad", slug: "hyderabad", code: "TG", pin: "500001", count: 298 },
  { name: "Chennai", slug: "chennai", code: "TN", pin: "600001", count: 276 },
  { name: "Kolkata", slug: "kolkata", code: "WB", pin: "700001", count: 241 },
] as const;

export const EXAMS: Exam[] = [
  { key: "JEE Main", fullName: "JEE Main 2027", conductedBy: "NTA", date: "2027-01-22", unit: "rank", acceptedBy: 1420 },
  { key: "JEE Advanced", fullName: "JEE Advanced 2027", conductedBy: "IIT organising institute", date: "2027-05-23", unit: "rank", acceptedBy: 23 },
  { key: "NEET UG", fullName: "NEET UG 2027", conductedBy: "NTA", date: "2027-05-02", unit: "rank", acceptedBy: 780 },
  { key: "CAT", fullName: "CAT 2026", conductedBy: "IIMs", date: "2026-11-29", unit: "pct", acceptedBy: 1250 },
  { key: "CUET UG", fullName: "CUET UG 2027", conductedBy: "NTA", date: "2027-05-15", unit: "pct", acceptedBy: 260 },
  { key: "CLAT", fullName: "CLAT 2027", conductedBy: "Consortium of NLUs", date: "2026-12-07", unit: "rank", acceptedBy: 24 },
  { key: "BITSAT", fullName: "BITSAT 2027", conductedBy: "BITS Pilani", date: "2027-05-20", unit: "score", acceptedBy: 3 },
  { key: "VITEEE", fullName: "VITEEE 2027", conductedBy: "VIT", date: "2027-04-19", unit: "rank", acceptedBy: 4 },
];

export const DEADLINES: Deadline[] = [
  { title: "CLAT 2027 applications close", by: "Consortium of NLUs", date: "2026-11-15", exam: "CLAT" },
  { title: "JEE Main 2027 · Session 1 registration closes", by: "NTA", date: "2026-11-27", exam: "JEE Main" },
  { title: "CAT 2026 exam day", by: "IIMs", date: "2026-11-29", exam: "CAT" },
  { title: "BITSAT 2027 registration opens", by: "BITS Pilani", date: "2027-01-10", exam: "BITSAT" },
];

export const NEWS: NewsItem[] = [
  { slug: "josaa-2027-rounds", category: "Counselling", title: "JoSAA 2027: how the six counselling rounds are expected to run", date: "2026-10-12", live: true },
  { slug: "neet-pg-round-1", category: "Medical", title: "NEET PG counselling: first-round registration opens for all-India quota seats", date: "2026-10-11", live: true },
  { slug: "cat-2026-admit-card", category: "MBA", title: "CAT 2026 admit cards are out — what to carry on exam day", date: "2026-10-10" },
  { slug: "ugc-net-december", category: "Exams", title: "UGC NET December cycle: application window closes on October 28", date: "2026-10-10" },
  { slug: "iit-placements-2026", category: "Placements", title: "Early placement numbers from the 2026 season at the older IITs", date: "2026-10-09" },
  { slug: "cuet-domain-subjects", category: "Guides", title: "CUET UG 2027: choosing domain subjects that keep your options open", date: "2026-10-08" },
];

export const SCHOLARSHIPS: Scholarship[] = [
  { name: "Central Sector Scheme of Scholarship", by: "Ministry of Education", amount: "₹12,000", per: "/ yr (UG)", eligibility: "Above the 80th percentile in Class 12, family income up to ₹4.5 lakh." },
  { name: "AICTE Pragati", by: "AICTE", amount: "₹50,000", per: "/ yr", eligibility: "Girl students in AICTE-approved degree or diploma programmes, family income up to ₹8 lakh." },
  { name: "AICTE Saksham", by: "AICTE", amount: "₹50,000", per: "/ yr", eligibility: "Students with 40% or more disability in AICTE-approved technical programmes." },
  { name: "INSPIRE-SHE", by: "Dept. of Science & Technology", amount: "₹80,000", per: "/ yr", eligibility: "Top 1% in Class 12 boards, pursuing natural or basic sciences." },
];

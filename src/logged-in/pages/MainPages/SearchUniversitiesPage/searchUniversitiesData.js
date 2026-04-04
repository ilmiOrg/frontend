/** Shared mock data for search list + detail routes
 *  logoUrl: official / Wikimedia-hosted marks (trademark may apply).
 *  Fictional listings use a close real-world logo as a visual stand-in.
 */

export const ALL = "all";
export const ALL_CITIES = "all";

export const MOCK_UNIVERSITIES = [
  {
    id: "1",
    slug: "technical-university-of-munich",
    abbr: "TUM",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c8/Logo_of_the_Technical_University_of_Munich.svg",
    name: "Technical University of Munich",
    type: "university",
    country: "Germany",
    city: "Munich",
    specializations: ["Engineering", "Computer Science"],
    tuitionAnnual: 3500,
    languages: ["English", "German"],
    degreeLevels: ["bachelor", "master", "phd"],
    imageUrl: "https://picsum.photos/seed/tumunich/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/tumunich1/900/560",
      "https://picsum.photos/seed/tumunich2/900/560",
      "https://picsum.photos/seed/tumunich3/900/560",
    ],
    shortDescription:
      "Leading European technical university with strong industry ties and English-taught master’s tracks in STEM.",
    detailDescription:
      "TUM ranks among Europe’s top universities for engineering and technology. Students benefit from research-driven teaching, Munich’s innovation ecosystem, and extensive English-language programmes at graduate level.",
  },
  {
    id: "2",
    slug: "sciences-po-paris",
    abbr: "SP",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/53/Logo_Sciences_Po.svg",
    name: "Sciences Po Paris",
    type: "university",
    country: "France",
    city: "Paris",
    specializations: ["Political Science", "Business", "Law"],
    tuitionAnnual: 12000,
    languages: ["English", "French"],
    degreeLevels: ["bachelor", "master"],
    imageUrl: "https://picsum.photos/seed/sciencespo/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/sciencespo1/900/560",
      "https://picsum.photos/seed/sciencespo2/900/560",
      "https://picsum.photos/seed/sciencespo3/900/560",
    ],
    shortDescription:
      "Prestigious social sciences school known for public affairs, international relations, and dual degrees worldwide.",
    detailDescription:
      "Sciences Po offers a multidisciplinary curriculum bridging politics, economics, law, and sociology, with campuses across France and a global partner network for exchanges and dual degrees.",
  },
  {
    id: "3",
    slug: "toronto-metropolitan-college",
    abbr: "TM",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/TMU_logo.svg",
    name: "Toronto Metropolitan College",
    type: "college",
    country: "Canada",
    city: "Toronto",
    specializations: ["Business", "Design", "Media"],
    tuitionAnnual: 18000,
    languages: ["English"],
    degreeLevels: ["bachelor", "diploma"],
    imageUrl: "https://picsum.photos/seed/torontomet/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/torontomet1/900/560",
      "https://picsum.photos/seed/torontomet2/900/560",
      "https://picsum.photos/seed/torontomet3/900/560",
    ],
    shortDescription:
      "Career-focused college in downtown Toronto emphasising creative industries, media, and practical business skills.",
    detailDescription:
      "Hands-on programmes, studio-based learning, and strong ties to employers help graduates move quickly into creative and business roles in one of North America’s largest cities.",
  },
  {
    id: "4",
    slug: "university-of-amsterdam",
    abbr: "UvA",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/78/University_of_Amsterdam_logo.svg",
    name: "University of Amsterdam",
    type: "university",
    country: "Netherlands",
    city: "Amsterdam",
    specializations: ["Economics", "Law", "Medicine"],
    tuitionAnnual: 4500,
    languages: ["English", "Dutch"],
    degreeLevels: ["bachelor", "master"],
    imageUrl: "https://picsum.photos/seed/uvaams/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/uvaams1/900/560",
      "https://picsum.photos/seed/uvaams2/900/560",
      "https://picsum.photos/seed/uvaams3/900/560",
    ],
    shortDescription:
      "Research-intensive university in a global city; many English-taught programmes in economics and social sciences.",
    detailDescription:
      "UvA combines strong research output with an open, international atmosphere. English tracks attract students from across the EU and beyond, especially in economics, law, and behavioural sciences.",
  },
  {
    id: "5",
    slug: "imperial-college-london",
    abbr: "IC",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Imperial_College_London.svg",
    name: "Imperial College London",
    type: "university",
    country: "United Kingdom",
    city: "London",
    specializations: ["Engineering", "Medicine", "Computer Science"],
    tuitionAnnual: 42000,
    languages: ["English"],
    degreeLevels: ["bachelor", "master", "phd"],
    imageUrl: "https://picsum.photos/seed/imperialuk/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/imperialuk1/900/560",
      "https://picsum.photos/seed/imperialuk2/900/560",
      "https://picsum.photos/seed/imperialuk3/900/560",
    ],
    shortDescription:
      "World-class STEM and medicine in central London, with intense research culture and strong employer reputation.",
    detailDescription:
      "Imperial focuses exclusively on science, engineering, medicine, and business. Expect rigorous programmes, cutting-edge labs, and proximity to London’s tech and healthcare sectors.",
  },
  {
    id: "6",
    slug: "barcelona-college-of-arts",
    abbr: "BCA",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_UPC.svg",
    name: "Barcelona College of Arts",
    type: "college",
    country: "Spain",
    city: "Barcelona",
    specializations: ["Arts", "Design", "Architecture"],
    tuitionAnnual: 8900,
    languages: ["English", "Spanish", "Catalan"],
    degreeLevels: ["bachelor", "master"],
    imageUrl: "https://picsum.photos/seed/bcnarts/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/bcnarts1/900/560",
      "https://picsum.photos/seed/bcnarts2/900/560",
      "https://picsum.photos/seed/bcnarts3/900/560",
    ],
    shortDescription:
      "Boutique arts college in Barcelona blending studio practice, Mediterranean design culture, and EU mobility.",
    detailDescription:
      "Small cohorts, workshop-heavy teaching, and a city known for architecture and visual culture make this a strong fit for creative portfolios and international inspiration.",
  },
  {
    id: "7",
    slug: "eth-zurich",
    abbr: "ETH",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/ea/ETH_Z%C3%BCrich_Logo.svg",
    name: "ETH Zurich",
    type: "university",
    country: "Switzerland",
    city: "Zurich",
    specializations: ["Engineering", "Mathematics", "Physics"],
    tuitionAnnual: 1600,
    languages: ["English", "German"],
    degreeLevels: ["bachelor", "master", "phd"],
    imageUrl: "https://picsum.photos/seed/ethzurich/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/ethzurich1/900/560",
      "https://picsum.photos/seed/ethzurich2/900/560",
      "https://picsum.photos/seed/ethzurich3/900/560",
    ],
    shortDescription:
      "Elite science and technology university with low public fees, exceptional research output, and alpine quality of life.",
    detailDescription:
      "ETH Zurich consistently ranks among the world’s top institutions for STEM. English is widely used at master’s and PhD level; undergraduate teaching is often German-based with increasing English options.",
  },
  {
    id: "8",
    slug: "boston-international-college",
    abbr: "BI",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/31/Boston_University_wordmark.svg",
    name: "Boston International College",
    type: "college",
    country: "United States",
    city: "Boston",
    specializations: ["Business", "Hospitality"],
    tuitionAnnual: 28000,
    languages: ["English"],
    degreeLevels: ["bachelor", "associate"],
    imageUrl: "https://picsum.photos/seed/bostonintl/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/bostonintl1/900/560",
      "https://picsum.photos/seed/bostonintl2/900/560",
      "https://picsum.photos/seed/bostonintl3/900/560",
    ],
    shortDescription:
      "International college focused on business fundamentals and hospitality management in a major US student hub.",
    detailDescription:
      "Internships with local hotels and companies, a diverse student body, and pathways from associate to bachelor degrees support career entry in business and service industries.",
  },
  {
    id: "9",
    slug: "university-of-melbourne",
    abbr: "UoM",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c2/Arms_of_the_University_of_Melbourne.svg",
    name: "University of Melbourne",
    type: "university",
    country: "Australia",
    city: "Melbourne",
    specializations: ["Medicine", "Sciences", "Law"],
    tuitionAnnual: 32000,
    languages: ["English"],
    degreeLevels: ["bachelor", "master", "phd"],
    imageUrl: "https://picsum.photos/seed/unimelb/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/unimelb1/900/560",
      "https://picsum.photos/seed/unimelb2/900/560",
      "https://picsum.photos/seed/unimelb3/900/560",
    ],
    shortDescription:
      "Australia’s top-ranked comprehensive university, strong in medicine, sciences, and graduate professional schools.",
    detailDescription:
      "Melbourne’s model emphasises breadth at undergraduate level and specialisation in graduate programmes. Campus life and research intensity attract students from across the Asia-Pacific region.",
  },
  {
    id: "10",
    slug: "humboldt-university-berlin",
    abbr: "HU",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/ce/Huberlin-logo.svg",
    name: "Humboldt University Berlin",
    type: "university",
    country: "Germany",
    city: "Berlin",
    specializations: ["Law", "History", "Data Science"],
    tuitionAnnual: 0,
    languages: ["English", "German"],
    degreeLevels: ["bachelor", "master", "phd"],
    imageUrl: "https://picsum.photos/seed/huberlin/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/huberlin1/900/560",
      "https://picsum.photos/seed/huberlin2/900/560",
      "https://picsum.photos/seed/huberlin3/900/560",
    ],
    shortDescription:
      "Historic research university in Berlin with low fees, humanities strength, and growing data-science offerings.",
    detailDescription:
      "Founded in 1810, Humboldt-Universität zu Berlin sits in the city centre with strong law, humanities, and interdisciplinary programmes. Many courses are German-taught; selected master’s are in English.",
  },
  {
    id: "11",
    slug: "american-university-of-central-asia",
    abbr: "AUCA",
    /* No stable Commons logo; shows initials. Add logoUrl when you host e.g. /university-logos/auca.svg */
    name: "American University of Central Asia",
    type: "university",
    country: "Kyrgyzstan",
    city: "Bishkek",
    specializations: ["Business", "Law", "Political Science", "Media"],
    tuitionAnnual: 9200,
    languages: ["English", "Russian", "Kyrgyz"],
    degreeLevels: ["bachelor", "master"],
    imageUrl: "https://picsum.photos/seed/auca1/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/auca1/900/560",
      "https://picsum.photos/seed/auca2/900/560",
      "https://picsum.photos/seed/auca3/900/560",
    ],
    shortDescription:
      "US-style liberal arts university in Bishkek, strong in governance, journalism, business, and Central Asian studies.",
    detailDescription:
      "AUCA offers an English-medium curriculum with American accreditation pathways, a diverse regional student body, and deep ties to civil society and media in Central Asia.",
  },
  {
    id: "12",
    slug: "university-of-central-asia",
    abbr: "UCA",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Logo_UCA.svg",
    name: "University of Central Asia",
    type: "university",
    country: "Kyrgyzstan",
    city: "Naryn",
    specializations: [
      "Economics",
      "Computer Science",
      "Media",
      "Sciences",
      "Political Science",
    ],
    tuitionAnnual: 4800,
    languages: ["English", "Russian"],
    degreeLevels: ["bachelor", "master"],
    imageUrl: "https://picsum.photos/seed/uca1/640/400",
    galleryUrls: [
      "https://picsum.photos/seed/uca1/900/560",
      "https://picsum.photos/seed/uca2/900/560",
      "https://picsum.photos/seed/uca3/900/560",
    ],
    shortDescription:
      "Research-led university serving mountain regions, with programmes in development, digital technologies, and environmental sciences.",
    detailDescription:
      "UCA was founded to strengthen higher education in Central Asia’s high-mountain communities. Campuses in the region emphasise field-based learning, graduate research, and engagement with local development challenges.",
  },
];

export const COUNTRY_OPTIONS = [
  ALL,
  "Australia",
  "Canada",
  "France",
  "Germany",
  "Italy",
  "Kyrgyzstan",
  "Netherlands",
  "Spain",
  "Switzerland",
  "United Kingdom",
  "United States",
];

export const SPECIALIZATION_OPTIONS = [
  ALL,
  "Architecture",
  "Arts",
  "Business",
  "Computer Science",
  "Data Science",
  "Design",
  "Economics",
  "Engineering",
  "History",
  "Hospitality",
  "Law",
  "Mathematics",
  "Media",
  "Medicine",
  "Physics",
  "Political Science",
  "Sciences",
];

export function citiesForCountry(country) {
  if (country === ALL) return [ALL_CITIES];
  const set = new Set([ALL_CITIES]);
  MOCK_UNIVERSITIES.filter((u) => u.country === country).forEach((u) =>
    set.add(u.city)
  );
  return Array.from(set);
}

export function getUniversityBySlug(slug) {
  return MOCK_UNIVERSITIES.find((u) => u.slug === slug) ?? null;
}

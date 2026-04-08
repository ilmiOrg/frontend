export const ALL = "all";
export const ALL_CITIES = "all";

export function slugify(name) {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferType(name) {
  const lower = (name || "").toLowerCase();
  return lower.includes("college") ? "college" : "university";
}

export function mapUniversityFromApi(u) {
  const slug = `${slugify(u.name)}-${(u.universityId || "").slice(0, 8)}`;

  const fields = u.fields || [];
  const specializations = fields.map((f) => f.fieldName);

  const langSet = new Set();
  const degreeSet = new Set();
  fields.forEach((f) => {
    (f.languages || []).forEach((l) => langSet.add(l));
    (f.degreeLevels || []).forEach((d) => degreeSet.add(d));
  });

  return {
    universityId: u.universityId,
    slug,
    abbr: null,
    logoUrl: u.logoUrl || "",
    name: u.name,
    type: inferType(u.name),
    country: u.countryName || "",
    countryCode: u.countryCode || "",
    city: u.city || "",
    specializations,
    tuitionAnnual: Number(u.avgTuitionPerYear || 0),
    languages: Array.from(langSet),
    degreeLevels: Array.from(degreeSet),
    fields,
    imageUrl: "https://picsum.photos/seed/defaultuni/640/400",
    galleryUrls: [],
    shortDescription: u.description || "",
    detailDescription: u.description || "",
  };
}

export function citiesForCountry(country, universities) {
  if (country === ALL) return [ALL_CITIES];
  const set = new Set([ALL_CITIES]);
  universities.filter((u) => u.country === country).forEach((u) => {
    if (u.city) set.add(u.city);
  });
  return Array.from(set);
}

export function countryOptionsFromUniversities(universities) {
  const countries = Array.from(
    new Set(universities.map((u) => u.country).filter(Boolean))
  ).sort();
  return [ALL, ...countries];
}

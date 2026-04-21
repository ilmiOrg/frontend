const EUROPE_COUNTRIES = new Set([
  "Germany",
  "France",
  "United Kingdom",
  "Netherlands",
  "Spain",
  "Italy",
  "Switzerland",
]);

function matchesBusiness(specs) {
  return specs.some((s) =>
    ["Business", "Economics", "Law", "Political Science"].includes(s)
  );
}

function matchesMedicine(specs) {
  return specs.some((s) => ["Medicine", "Sciences"].includes(s));
}

function matchesArts(specs) {
  return specs.some((s) => ["Arts", "Design", "Architecture", "Media"].includes(s));
}

/**
 * Same popular + name rules as SearchUniversitiesPage (teaser has no country / tuition / etc.).
 */
export function filterUniversitiesTeaser(universities, nameQuery, popular) {
  const q = (nameQuery || "").trim().toLowerCase();
  return universities.filter((u) => {
    if (q && !u.name.toLowerCase().includes(q)) return false;
    if (popular.affordable && u.tuitionAnnual > 10000) return false;
    if (popular.budget && u.tuitionAnnual > 5000) return false;
    if (popular.english && !u.languages.includes("English")) return false;
    if (popular.europe && !EUROPE_COUNTRIES.has(u.country)) return false;
    const specs = u.specializations || [];
    if (popular.business && !matchesBusiness(specs)) return false;
    if (popular.medicine && !matchesMedicine(specs)) return false;
    if (popular.arts && !matchesArts(specs)) return false;
    return true;
  });
}

const ALL = "all";

/**
 * Count universities matching field teaser (mirrors SearchFieldsPage when fields are selected).
 */
export function countUniversitiesForFieldTeaser(universities, selectedFieldIds, degreeLevel, language) {
  if (!selectedFieldIds || selectedFieldIds.size === 0) return null;

  return universities.filter((u) => {
    const uniFields = u.fields || [];

    const hasFieldMatch = uniFields.some((f) => selectedFieldIds.has(f.fieldId));
    if (!hasFieldMatch) return false;

    if (degreeLevel !== ALL) {
      const hasLevel = uniFields.some((f) => (f.degreeLevels || []).includes(degreeLevel));
      if (!hasLevel) return false;
    }

    if (language !== ALL) {
      const hasLang = uniFields.some((f) => (f.languages || []).includes(language));
      if (!hasLang) return false;
    }

    return true;
  }).length;
}

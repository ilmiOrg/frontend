/**
 * University fields catalog.
 *
 * Backend `master` exposes the `Field` enum only inside Program responses
 * (no GET /api/v1/university-fields endpoint exists). We keep the enum
 * as a stable client-side catalog so search/filter UIs work without
 * phantom API calls.
 *
 * Shape matches what consumers expect: { fieldId, fieldSlug, fieldName }.
 * `fieldId` mirrors the backend enum literal — pass it directly when filtering
 * Programs by `fieldType`.
 */

const FIELDS = [
  { fieldId: "COMPUTER_SCIENCE", fieldSlug: "computer-science-it", fieldName: "Computer Science & IT" },
  { fieldId: "ENGINEERING", fieldSlug: "engineering", fieldName: "Engineering" },
  { fieldId: "MEDICINE", fieldSlug: "medicine-health", fieldName: "Medicine & Health" },
  { fieldId: "LAW", fieldSlug: "law", fieldName: "Law" },
  { fieldId: "BUSINESS", fieldSlug: "business-management", fieldName: "Business & Management" },
  { fieldId: "ECONOMICS", fieldSlug: "economics", fieldName: "Economics" },
  { fieldId: "MATHEMATICS", fieldSlug: "mathematics", fieldName: "Mathematics" },
  { fieldId: "PHYSICS", fieldSlug: "physics", fieldName: "Physics" },
  { fieldId: "BIOLOGY", fieldSlug: "biology", fieldName: "Biology" },
  { fieldId: "CHEMISTRY", fieldSlug: "chemistry", fieldName: "Chemistry" },
  { fieldId: "HUMANITIES", fieldSlug: "humanities", fieldName: "Humanities" },
  { fieldId: "SOCIAL_SCIENCES", fieldSlug: "social-sciences", fieldName: "Social Sciences" },
  { fieldId: "ARTS", fieldSlug: "arts-design", fieldName: "Arts & Design" },
  { fieldId: "EDUCATION", fieldSlug: "education", fieldName: "Education" },
  { fieldId: "ARCHITECTURE", fieldSlug: "architecture", fieldName: "Architecture" },
];

export async function getUniversityFields() {
  return FIELDS;
}

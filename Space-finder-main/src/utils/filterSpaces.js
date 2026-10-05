// filterSpaces.js
// Utility to filter rest spaces by features, crowd, and score
export function filterSpaces(spaces, { search = "", features = [], crowd = "all", minScore = 0 }) {
  return spaces.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase());
    const matchFeatures = features.length === 0 || features.every((f) => s.features.includes(f));
    const matchCrowd = crowd === "all" || s.crowdLevel === crowd;
    const matchScore = s.accessibilityScore >= minScore;
    return matchSearch && matchFeatures && matchCrowd && matchScore;
  });
}

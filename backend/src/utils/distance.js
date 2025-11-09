// Haversine formula to calculate distance between two coordinates in miles
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Radius of Earth in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

// Calculate match score for SMART MATCHING
// Weights: Distance (40%) + Availability (30%) + Performance (30%)
export const calculateMatchScore = (specialist, patientLat, patientLon) => {
  // 1. Distance Score (0-100, inverse - closer is better)
  const distance = calculateDistance(
    patientLat,
    patientLon,
    specialist.latitude,
    specialist.longitude
  );
  const maxDistance = 50; // Consider 50 miles as maximum reasonable distance
  const distanceScore = Math.max(0, 100 - (distance / maxDistance) * 100);

  // 2. Availability Score (0-100, based on wait days - shorter is better)
  const maxWaitDays = 30; // Consider 30 days as maximum wait
  const availabilityScore = Math.max(
    0,
    100 - ((specialist.avgWaitDays || 0) / maxWaitDays) * 100
  );

  // 3. Performance Score (0-100, combination of rating and completion rate)
  const ratingScore = ((specialist.rating || 0) / 5) * 100; // Convert 0-5 to 0-100
  const completionScore = (specialist.completionRate || 0) * 100; // Already 0-1, convert to 0-100
  const performanceScore = (ratingScore + completionScore) / 2;

  // Calculate weighted total score
  const totalScore =
    distanceScore * 0.4 + availabilityScore * 0.3 + performanceScore * 0.3;

  return {
    totalScore: Math.round(totalScore),
    distanceScore: Math.round(distanceScore),
    availabilityScore: Math.round(availabilityScore),
    performanceScore: Math.round(performanceScore),
    distance: distance,
  };
};

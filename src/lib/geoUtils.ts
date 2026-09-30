/**
 * Geolocation & Distance Calculation Utilities for Pakistani Universities
 */

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface CityLocation {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

// Major Pakistani Cities Center Coordinates
export const PAKISTAN_CITIES: Record<string, CityLocation> = {
  'Islamabad': { name: 'Islamabad', province: 'Islamabad Capital Territory', latitude: 33.6844, longitude: 73.0479 },
  'Rawalpindi': { name: 'Rawalpindi', province: 'Punjab', latitude: 33.5651, longitude: 73.0169 },
  'Lahore': { name: 'Lahore', province: 'Punjab', latitude: 31.5204, longitude: 74.3587 },
  'Karachi': { name: 'Karachi', province: 'Sindh', latitude: 24.8607, longitude: 67.0011 },
  'Peshawar': { name: 'Peshawar', province: 'Khyber Pakhtunkhwa', latitude: 34.0151, longitude: 71.5249 },
  'Quetta': { name: 'Quetta', province: 'Balochistan', latitude: 30.1798, longitude: 66.9750 },
  'Faisalabad': { name: 'Faisalabad', province: 'Punjab', latitude: 31.4504, longitude: 73.1350 },
  'Multan': { name: 'Multan', province: 'Punjab', latitude: 30.1575, longitude: 71.5249 },
  'Bahawalpur': { name: 'Bahawalpur', province: 'Punjab', latitude: 29.3956, longitude: 71.6836 },
  'Gujrat': { name: 'Gujrat', province: 'Punjab', latitude: 32.5742, longitude: 74.0754 },
  'Gujranwala': { name: 'Gujranwala', province: 'Punjab', latitude: 32.1877, longitude: 74.1945 },
  'Sialkot': { name: 'Sialkot', province: 'Punjab', latitude: 32.4945, longitude: 74.5229 },
  'Sargodha': { name: 'Sargodha', province: 'Punjab', latitude: 32.0836, longitude: 72.6711 },
  'Sukkur': { name: 'Sukkur', province: 'Sindh', latitude: 27.7052, longitude: 68.8574 },
  'Hyderabad': { name: 'Hyderabad', province: 'Sindh', latitude: 25.3960, longitude: 68.3578 },
  'Jamshoro': { name: 'Jamshoro', province: 'Sindh', latitude: 25.4278, longitude: 68.2678 },
  'Swabi': { name: 'Swabi', province: 'Khyber Pakhtunkhwa', latitude: 34.1202, longitude: 72.4700 },
  'Abbottabad': { name: 'Abbottabad', province: 'Khyber Pakhtunkhwa', latitude: 34.1688, longitude: 73.2215 },
  'Mardan': { name: 'Mardan', province: 'Khyber Pakhtunkhwa', latitude: 34.1989, longitude: 72.0404 },
  'Muzaffarabad': { name: 'Muzaffarabad', province: 'Azad Jammu & Kashmir', latitude: 34.3700, longitude: 73.4700 },
  'Mirpur': { name: 'Mirpur', province: 'Azad Jammu & Kashmir', latitude: 33.1481, longitude: 73.7519 },
  'Gilgit': { name: 'Gilgit', province: 'Gilgit-Baltistan', latitude: 35.9208, longitude: 74.3144 },
  'Skardu': { name: 'Skardu', province: 'Gilgit-Baltistan', latitude: 35.2971, longitude: 75.6333 },
};

// University specific exact coordinates mapping
export const UNIVERSITY_COORDINATES: Record<string, GeoCoordinates> = {
  // Islamabad
  'nust': { latitude: 33.6425, longitude: 72.9904 },
  'qau': { latitude: 33.7483, longitude: 73.1368 },
  'fast-nuces': { latitude: 33.6555, longitude: 73.0163 },
  'comsats-university-islamabad': { latitude: 33.6518, longitude: 73.1566 },
  'iiui-islamabad': { latitude: 33.6593, longitude: 73.0242 },
  'pieas-islamabad': { latitude: 33.6705, longitude: 73.2560 },
  'aiou-islamabad': { latitude: 33.6844, longitude: 73.0560 },
  'numl-islamabad': { latitude: 33.6660, longitude: 73.0370 },
  'air-university-islamabad': { latitude: 33.7145, longitude: 73.0245 },
  'bahria-university-islamabad': { latitude: 33.7175, longitude: 73.0270 },

  // Punjab
  'pu-lahore': { latitude: 31.4988, longitude: 74.3023 },
  'lums': { latitude: 31.4707, longitude: 74.4109 },
  'uet-lahore': { latitude: 31.5794, longitude: 74.3562 },
  'gcu-lahore': { latitude: 31.5732, longitude: 74.3060 },
  'uaf-faisalabad': { latitude: 31.4300, longitude: 73.0700 },
  'bzu-multan': { latitude: 30.2644, longitude: 71.5036 },
  'iub-bahawalpur': { latitude: 29.3789, longitude: 71.7656 },
  'uog-gujrat': { latitude: 32.6416, longitude: 74.1594 },
  'itu-lahore': { latitude: 31.4756, longitude: 74.3429 },
  'kemu-lahore': { latitude: 31.5721, longitude: 74.3168 },

  // Sindh
  'ku-karachi': { latitude: 24.9416, longitude: 67.1141 },
  'iba-karachi': { latitude: 24.9392, longitude: 67.1128 },
  'aku-karachi': { latitude: 24.8924, longitude: 67.0747 },
  'ned-karachi': { latitude: 24.9348, longitude: 67.1118 },
  'sukkur-iba': { latitude: 27.7244, longitude: 68.8228 },
  'sindh-university-jamshoro': { latitude: 25.4278, longitude: 68.2678 },
  'muet-jamshoro': { latitude: 25.4056, longitude: 68.2606 },
  'duhs-karachi': { latitude: 24.8607, longitude: 67.0104 },

  // KPK
  'uop-peshawar': { latitude: 34.0005, longitude: 71.4828 },
  'giki': { latitude: 34.0700, longitude: 72.6433 },
  'uet-peshawar': { latitude: 34.0000, longitude: 71.4800 },
  'kmu-peshawar': { latitude: 33.9800, longitude: 71.4600 },

  // Balochistan
  'buitems': { latitude: 30.2394, longitude: 66.9744 },
  'uob-quetta': { latitude: 30.1600, longitude: 66.9900 },
  'sbkwu-quetta': { latitude: 30.2200, longitude: 66.9800 },

  // AJK
  'uajk': { latitude: 34.3700, longitude: 73.4700 },
  'must-mirpur': { latitude: 33.1481, longitude: 73.7519 },

  // Gilgit-Baltistan
  'kiu': { latitude: 35.9208, longitude: 74.3144 },
  'uobs-skardu': { latitude: 35.2971, longitude: 75.6333 }
};

/**
 * Calculate distance in kilometers between two GPS coordinates using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

/**
 * Format distance in a human readable string (e.g. "4.2 km" or "850 m")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Resolve coordinates for a university, falling back to its city if exact lat/lon is not defined
 */
export function getUniversityCoordinates(
  slug: string,
  city: string,
  explicitLat?: number,
  explicitLon?: number
): GeoCoordinates {
  if (explicitLat !== undefined && explicitLon !== undefined && explicitLat !== 0) {
    return { latitude: explicitLat, longitude: explicitLon };
  }

  if (UNIVERSITY_COORDINATES[slug]) {
    return UNIVERSITY_COORDINATES[slug];
  }

  const cityMatch = PAKISTAN_CITIES[city];
  if (cityMatch) {
    return { latitude: cityMatch.latitude, longitude: cityMatch.longitude };
  }

  // Default to Islamabad center if unknown
  return { latitude: 33.6844, longitude: 73.0479 };
}

/**
 * Request user's current GPS location via browser navigator.geolocation
 */
export async function getCurrentUserLocation(): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Find closest Pakistani city to a given latitude and longitude
 */
export function getClosestCity(lat: number, lon: number): CityLocation {
  let closest: CityLocation = PAKISTAN_CITIES['Islamabad'];
  let minDistance = Infinity;

  Object.values(PAKISTAN_CITIES).forEach((city) => {
    const dist = calculateDistanceKm(lat, lon, city.latitude, city.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  });

  return closest;
}

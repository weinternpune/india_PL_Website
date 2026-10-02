import { Worker, ServiceCategory } from '../types';

/**
 * Calculates great-circle distance between two GPS coordinates using the Haversine formula.
 * @returns distance in kilometers (rounded to 1 decimal place)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const toRad = (value: number) => (value * Math.PI) / 180;

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

  return Math.round(distance * 10) / 10;
}

export interface WorkerMatchCandidate {
  worker: Worker;
  distanceKm: number;
}

/**
 * Finds all suitable available workers sorted by Haversine distance from customer GPS.
 *
 * Rules:
 * 1. Must support required service category or specific service name.
 * 2. Must be Available (not Busy or Offline).
 * 3. Must be Active account (not Suspended or Pending).
 * 4. Must be Verified.
 * 5. Excludes workers who already rejected or timed out.
 */
export function findNearestAvailableWorkers(
  customerLat: number,
  customerLng: number,
  requiredCategory: ServiceCategory | string,
  workers: Worker[],
  excludedWorkerIds: string[] = []
): WorkerMatchCandidate[] {
  const eligibleWorkers = workers.filter((worker) => {
    // Check exclusion
    if (excludedWorkerIds.includes(worker.workerId)) {
      return false;
    }

    // Check account state
    if (worker.status !== 'Active') {
      return false;
    }

    // Check verification
    if (worker.verificationStatus !== 'Verified') {
      return false;
    }

    // Check availability
    if (worker.availability !== 'Available') {
      return false;
    }

    // Check service category match
    const categoryMatches =
      worker.categories.includes(requiredCategory as ServiceCategory) ||
      worker.services.some(
        (s) =>
          s.toLowerCase().includes(requiredCategory.toLowerCase()) ||
          requiredCategory.toLowerCase().includes(s.toLowerCase())
      );

    return categoryMatches;
  });

  // Calculate distance for all eligible workers
  const candidates: WorkerMatchCandidate[] = eligibleWorkers.map((worker) => {
    const distanceKm = calculateHaversineDistance(
      customerLat,
      customerLng,
      worker.latitude,
      worker.longitude
    );
    return { worker, distanceKm };
  });

  // Sort ascending: nearest worker first
  candidates.sort((a, b) => a.distanceKm - b.distanceKm);

  return candidates;
}

/**
 * Returns the single nearest available worker or null if none available
 */
export function findNearestAvailableWorker(
  customerLat: number,
  customerLng: number,
  requiredCategory: ServiceCategory | string,
  workers: Worker[],
  excludedWorkerIds: string[] = []
): WorkerMatchCandidate | null {
  const matches = findNearestAvailableWorkers(
    customerLat,
    customerLng,
    requiredCategory,
    workers,
    excludedWorkerIds
  );
  return matches.length > 0 ? matches[0] : null;
}

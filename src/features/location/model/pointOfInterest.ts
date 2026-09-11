export type PointOfInterest = {
  id: string
  name: string
  category: string
  description: string
  distanceMeters: number
  walkingMinutes: number
  /** Placement on the schematic map, in its own 700x470 coordinate space. */
  map: {
    x: number
    y: number
    line: string
    labelX: number
    labelY: number
    nameX: number
    nameY: number
  }
}

export function formatDistance(poi: PointOfInterest): string {
  return poi.distanceMeters >= 1000
    ? `${(poi.distanceMeters / 1000).toLocaleString('es-CO', { maximumFractionDigits: 1 })} km`
    : `${poi.distanceMeters} m`
}

export function formatWalk(poi: PointOfInterest): string {
  return `${poi.walkingMinutes} min caminando`
}

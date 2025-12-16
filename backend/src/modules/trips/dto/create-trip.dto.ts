export interface CreateTripDto {
  code: string;
  driver: string;
  truck: string;
  trailer?: string;
  origin: string;
  destination: string;
  distance: number;
  startKm: number;
}

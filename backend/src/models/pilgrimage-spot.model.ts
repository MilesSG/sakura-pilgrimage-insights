export interface PilgrimageSpot {
  id: number;
  name: string;
  anime: string;
  lat: number;
  lng: number;
  popularity: number;
  imageUrl: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
} 
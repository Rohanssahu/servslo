import client from './client';

export interface ServiceItem {
  id: string;
  name: string;
  name_en: string;
  emoji: string;
  category: string;
  base_price: number;
  rating: number;
  review_count: number;
  is_available: boolean;
  tags?: string[];
}

export interface CategoryItem {
  id: string;
  label: string;
  label_en: string;
}

export interface ServicesResponse {
  services: ServiceItem[];
  categories: CategoryItem[];
}

export interface HomeFeedItem {
  id: string;
  name: string;
  name_en: string;
  emoji: string;
  base_price: number;
  category: string;
  booking_count?: number;
  rating?: number;
}

export interface HomeFeedResponse {
  location: {city: string; area: string; lat: number; lng: number};
  daily_services: HomeFeedItem[];
  most_booked: HomeFeedItem[];
  active_campaigns: any[];
}

export const getServices = (params?: {lat?: number; lng?: number; category?: string}): Promise<ServicesResponse> =>
  client.get('/services', {params}).then(r => r.data);

export const getServiceDetail = (serviceId: string) =>
  client.get(`/services/${serviceId}`).then(r => r.data);

export const getHomeFeed = (params?: {lat?: number; lng?: number}): Promise<HomeFeedResponse> =>
  client.get('/home/feed', {params}).then(r => r.data);

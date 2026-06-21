import client from './client';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  gender: string;
  photo_url: string;
  referral_code: string;
  language: string;
  wallet_balance: number;
  created_at: string;
}

export interface AddressItem {
  id: string;
  type: 'home' | 'office' | 'other';
  label: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  landmark?: string;
  lat: number;
  lng: number;
  is_default: boolean;
}

export const getProfile = (): Promise<UserProfile> =>
  client.get('/users/me').then(r => r.data);

export const updateProfile = (form: FormData) =>
  client
    .patch('/users/me', form, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then(r => r.data);

export const listAddresses = (): Promise<{addresses: AddressItem[]}> =>
  client.get('/users/me/addresses').then(r => r.data);

export const addAddress = (payload: Omit<AddressItem, 'id' | 'is_default'> & {is_default?: boolean}) =>
  client.post('/users/me/addresses', payload).then(r => r.data);

export const updateAddress = (id: string, payload: Partial<AddressItem>) =>
  client.patch(`/users/me/addresses/${id}`, payload).then(r => r.data);

export const deleteAddress = (id: string) =>
  client.delete(`/users/me/addresses/${id}`).then(r => r.data);

export const updateFcmToken = (fcmToken: string) =>
  client.patch('/users/me/fcm-token', {fcm_token: fcmToken}).then(r => r.data);

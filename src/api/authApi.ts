import client, {BASE_URL} from './client';
import axios from 'axios';

export interface SendOtpPayload {
  phone: string;
  country_code: string;
}

export interface VerifyOtpPayload {
  phone: string;
  country_code: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  is_new_user: boolean;
  // existing user fields
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    name: string;
    phone: string;
    gender: string;
    photo_url: string;
    referral_code: string;
    language: string;
    created_at: string;
  };
  // new user fields
  temp_token?: string;
}

export const sendOtp = (payload: SendOtpPayload) =>
  client.post('/auth/send-otp', payload).then(r => r.data);

export const verifyOtp = (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> =>
  client.post('/auth/verify-otp', payload).then(r => r.data);

export const completeProfile = (form: FormData, tempToken: string) =>
  axios
    .post(`${BASE_URL}/auth/complete-profile`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${tempToken}`,
      },
    })
    .then(r => r.data);

export const refreshTokenApi = (refreshToken: string) =>
  axios
    .post(`${BASE_URL}/auth/refresh`, {refresh_token: refreshToken})
    .then(r => r.data);

export const logoutApi = (fcmToken?: string) =>
  client.post('/auth/logout', {fcm_token: fcmToken ?? ''}).then(r => r.data);

export const deleteAccountApi = () =>
  client.delete('/users/me').then(r => r.data);

// src/services/api/wallOfJoyApi.ts
import { apiClient } from './apiClient';
import { ApiResponse, Moment } from '../../types';

class WallOfJoyApi {
  async getActiveMoments(page: number = 1, limit: number = 20): Promise<ApiResponse<{ moments: Moment[]; totalPages: number; currentPage: number; total: number }>> {
    return apiClient.get(`/wall-of-joy/moments?page=${page}&limit=${limit}`);
  }

  async addHeart(momentId: string): Promise<ApiResponse<{ hearts: number }>> {
    return apiClient.post(`/wall-of-joy/moments/${momentId}/heart`, {});
  }

  async removeHeart(momentId: string): Promise<ApiResponse<{ hearts: number }>> {
    return apiClient.delete(`/wall-of-joy/moments/${momentId}/heart`);
  }
}

export const wallOfJoyApi = new WallOfJoyApi();
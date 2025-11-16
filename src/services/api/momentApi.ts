// src/services/api/momentApi.ts
import { apiClient } from './apiClient';
import { ApiResponse, Moment } from '../../types';

export interface CreateMomentRequest {
  category: string;
  subCategory: string;
  content: string;
  languages: string[];
  scheduleType: 'immediate' | 'later';
  scheduledTime?: string;
  activeTime: number;
}

export interface UpdateMomentRequest {
  content?: string;
  languages?: string[];
}

class MomentApi {
  async createMoment(data: CreateMomentRequest): Promise<ApiResponse<{ moment: Moment }>> {
    return apiClient.post('/moments', data);
  }

  async getUserMoments(status?: string): Promise<ApiResponse<{ moments: Moment[] }>> {
    const url = status ? `/moments?status=${status}` : '/moments';
    return apiClient.get(url);
  }

  async updateMoment(momentId: string, data: UpdateMomentRequest): Promise<ApiResponse<{ moment: Moment }>> {
    return apiClient.put(`/moments/${momentId}`, data);
  }

  async deleteMoment(momentId: string): Promise<ApiResponse> {
    return apiClient.delete(`/moments/${momentId}`);
  }

  async getAvailableMoments(category?: string): Promise<ApiResponse<{ moments: Moment[]; categoryCounts: any[] }>> {
    const url = category ? `/moments/available?category=${category}` : '/moments/available';
    return apiClient.get(url);
  }
}

export const momentApi = new MomentApi();
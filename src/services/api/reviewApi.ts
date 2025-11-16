// src/services/api/reviewApi.ts
import { apiClient } from './apiClient';
import { ApiResponse, Review } from '../../types';

export interface SubmitReviewRequest {
  callId: string;
  rating: number;
}

class ReviewApi {
  async submitReview(data: SubmitReviewRequest): Promise<ApiResponse<{ review: Review }>> {
    return apiClient.post('/reviews', data);
  }

  async getUserReviews(type: 'received' | 'given' = 'received'): Promise<ApiResponse<{ reviews: Review[] }>> {
    return apiClient.get(`/reviews?type=${type}`);
  }
}

export const reviewApi = new ReviewApi();
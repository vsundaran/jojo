// src/services/api/reportApi.ts
import { apiClient } from './apiClient';
import { ApiResponse } from '../../types';

export interface SubmitReportRequest {
  callId: string;
  issueType: string;
  description: string;
}

class ReportApi {
  async submitReport(data: SubmitReportRequest): Promise<ApiResponse> {
    return apiClient.post('/reports', data);
  }

  async startRecording(callId: string): Promise<ApiResponse<{ recordingId: string }>> {
    return apiClient.post(`/reports/${callId}/start-recording`, {});
  }
}

export const reportApi = new ReportApi();
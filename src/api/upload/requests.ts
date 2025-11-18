import request from '../axios';
import type { IUploadResponse } from './types';

export const uploadSingleFile = async (formData: FormData, onProgress?: (progress: number) => void): Promise<IUploadResponse> => {
  const { data } = await request({
    url: 'api/upload/single',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round((progressEvent.loaded / Number(progressEvent.total || 0)) * 100);
        onProgress(progress);
      }
    },
    data: formData,
  });

  return data?.data;
};

export const uploadMultiFile = async (formData: FormData, onProgress?: (progress: number) => void): Promise<IUploadResponse[]> => {
  const { data } = await request({
    url: 'api/upload/multiple',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round((progressEvent.loaded / Number(progressEvent.total || 0)) * 100);
        onProgress(progress);
      }
    },
    data: formData,
  });

  return data?.data;
};

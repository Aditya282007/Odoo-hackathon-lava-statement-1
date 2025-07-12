import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(res: Response, message: string, data?: T, statusCode: number = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data
  };
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, statusCode: number = 400, error?: string): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error
  };
  res.status(statusCode).json(response);
};
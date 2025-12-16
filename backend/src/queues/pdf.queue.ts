import Queue from 'bull';

export interface PdfJobData {
  tripId: string;
  userId: string;
}

export const pdfQueue = new Queue<PdfJobData>('pdf-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

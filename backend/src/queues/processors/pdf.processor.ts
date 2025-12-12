import { Job } from 'bull';
import puppeteer from 'puppeteer';
import { PdfJobData } from '../pdf.queue';
import { TripModel } from '../../database/models/trip.model';
import { UserModel } from '../../database/models/user.model';
import { TruckModel } from '../../database/models/truck.model';
import { TrailerModel } from '../../database/models/trailer.model';
import fs from 'fs';
import path from 'path';

export async function processPdfGeneration(job: Job<PdfJobData>) {
  const { tripId } = job.data;

  const trip = await TripModel.findById(tripId)
    .populate('driver', 'firstName lastName email')
    .populate('truck', 'registration brand truckModel')
    .populate('trailer', 'registration type');

  if (!trip) {
    throw new Error('Trip not found');
  }

  const html = generateTripOrderHtml(trip);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html);

  const pdfDir = path.join(__dirname, '../../../public/pdfs');
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const pdfPath = path.join(pdfDir, `trip-${tripId}.pdf`);
  await page.pdf({ path: pdfPath, format: 'A4' });

  await browser.close();

  return { pdfUrl: `/pdfs/trip-${tripId}.pdf` };
}

function generateTripOrderHtml(trip: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin: 20px 0; }
        .label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Trip Order</h1>
        <p>Code: ${trip.code}</p>
      </div>
      
      <div class="section">
        <h2>Trip Details</h2>
        <table>
          <tr><td class="label">Origin</td><td>${trip.origin}</td></tr>
          <tr><td class="label">Destination</td><td>${trip.destination}</td></tr>
          <tr><td class="label">Distance</td><td>${trip.distance} km</td></tr>
          <tr><td class="label">Status</td><td>${trip.status}</td></tr>
        </table>
      </div>

      <div class="section">
        <h2>Driver Information</h2>
        <table>
          <tr><td class="label">Name</td><td>${trip.driver?.firstName} ${trip.driver?.lastName}</td></tr>
          <tr><td class="label">Email</td><td>${trip.driver?.email}</td></tr>
        </table>
      </div>

      <div class="section">
        <h2>Vehicle Information</h2>
        <table>
          <tr><td class="label">Truck</td><td>${trip.truck?.registration} - ${trip.truck?.brand} ${trip.truck?.truckModel}</td></tr>
          ${trip.trailer ? `<tr><td class="label">Trailer</td><td>${trip.trailer.registration} - ${trip.trailer.type}</td></tr>` : ''}
        </table>
      </div>

      <div class="section">
        <h2>Kilometers</h2>
        <table>
          <tr><td class="label">Start KM</td><td>${trip.startKm}</td></tr>
          ${trip.endKm ? `<tr><td class="label">End KM</td><td>${trip.endKm}</td></tr>` : ''}
          ${trip.fuelConsumed ? `<tr><td class="label">Fuel Consumed</td><td>${trip.fuelConsumed} L</td></tr>` : ''}
        </table>
      </div>
    </body>
    </html>
  `;
}

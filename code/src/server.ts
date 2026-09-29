import { createApp } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` CivicConnect Platform API Server (SEN381 NQF Level 8)`);
  console.log(` Running in Clean Layered Architecture Mode`);
  console.log(` Port: ${PORT} | Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Healthcheck: http://localhost:${PORT}/health/live`);
  console.log(`=======================================================`);
});

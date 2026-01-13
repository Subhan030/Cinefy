import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import * as dns from 'node:dns';

// Force usage of IPv4 for DNS resolution to avoid ECONNRESET on some environments
try {
    dns.setDefaultResultOrder('ipv4first');
} catch (e) {
    console.log("Could not set default result order for DNS:", e);
}
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();
const port = 3000;

await connectDB()
// Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
// API Routes
app.get('/', (req, res) => res.send('Server is Live!'))
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter)
app.use("/api/admin", adminRouter)
app.use("/api/user", userRouter)

// Export the app for Vercel
export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
}
import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import errorMiddleware from './src/middlewares/error.middleware';
import { connectToDatabase } from './src/startup/db';
import routes from './src/routes/index';
import { handleGlobalErrors } from './src/startup/errorHandlers';
import { logger } from './src/startup/logger';
import { addRewardPercentage, createAdmin } from './src/startup/seeder';
import { listenStripeEvents } from './src/controllers/subscribe.controller';
import startScheduler from './src/jobs/jobs';
import { getPlansFromStripe } from './src/utils/payment_gateway';

async function main() {
    handleGlobalErrors();

    connectToDatabase();
    await createAdmin();
    await addRewardPercentage();
    await getPlansFromStripe();

    startScheduler();

    const app: Application = express();
    const PORT = process.env.PORT || 3000;

    app.post('/api/subscription/webhook', express.raw({ type: 'application/json' }), listenStripeEvents);

    app.use(cors());
    app.use(express.json());
    app.use(fileUpload());
    app.use('/api', routes);

    app.get('/', (req: Request, res: Response) => {
        res.json({ message: 'Welcome to the Express TypeScript App!' });
    });

    app.use(errorMiddleware);

    app.listen(PORT, () => {
        logger.info(`🚀 Server running on port ${PORT}`);
    });
}

main();

import express from 'express';
import { PORT } from './config';
// import { databaseConnection } from './database';
import expressApp from './express-app';
import { print } from './utils/console_utils';

const StartServer = async() => {

    const app = express();
    
    // await databaseConnection();
    
    await expressApp(app);

    app.listen(PORT, () => {
        print(`⚡️[server]: Server is running at http://localhost:${PORT}`,"success");
      })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();
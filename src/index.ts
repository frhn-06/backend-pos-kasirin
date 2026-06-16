import express, { Request, Response } from 'express'
import database from './utils/database';
import cors from 'cors';
import bodyParser from 'body-parser';
import routerApi from './routes/api';



const init = async () => {
    try {

        const resultDb = await database();
        console.log("database status is : " + resultDb);

        const app = express();
        const port = 3001;

        app.use(cors());
        app.use(bodyParser.json());


        app.get("/", (req: Request, res: Response) => {
            return res.status(200).json({
                name: "aplikasi pos sass"
            })
        })

        app.use('/api', routerApi);
        
        app.listen(port, () => {
            console.log("server runnning on localhost prot : " + port);
        })
    } catch(error) {
        console.log(error);
    } 
} 


init();
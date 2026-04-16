import app from "./app.js";
import { config } from "./src/config/config.js";
import { connectDB } from "./src/config/db.js";


const startServer = async () => {
    try{
        await connectDB();
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    }catch(error){
        console.log(error+"error in server start");
    }
}

startServer();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
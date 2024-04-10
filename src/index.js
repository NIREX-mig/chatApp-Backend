import { httpServer } from "./app.js";
import connectToMongo from "./db/index.js";

const startServer = () => {
    httpServer.listion(process.env.PORT || 8000, () => {
        console.log(`server listening at port : ${process.env.PORT}` )
    })
}

connectToMongo()
.then(()=>{
    startServer();
})
.catch((err) => {
    console.log(`mongodb connection Error :` + err);
})
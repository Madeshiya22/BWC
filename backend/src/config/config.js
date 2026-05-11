import dotenv from "dotenv";

dotenv.config();

if(!process.env.PORT){
    throw new Error("Port is not defined");
}


if(!process.env.MONGODB_URI){
    throw new Error("MongoDB URI is not defined");
}

if(!process.env.ACCESS_TOKEN_SECRET){
    throw new Error("Access Token is not defined");
}

if(!process.env.REFRESH_TOKEN_SECRET){
    throw new Error("Refresh Token is not defined");
}

export const config = {
    port: process.env.PORT,
    mongoURI: process.env.MONGODB_URI,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
}

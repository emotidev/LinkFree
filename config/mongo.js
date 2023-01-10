import mongoose from "mongoose";
import * as fs from "fs";

let hasConnection = false;

const mongoConnectionString = process.env.LINKFREE_MONGO_CONNECTION_STRING ?? process.env.MONGODB_URI

const connectMongo = async () => {
  if (!mongoConnectionString) {
    throw new Error(
      "Please define the LINKFREE_MONGO_CONNECTION_STRING environment variable (if local add to .env file)"
    );
  }

  if (hasConnection) {
    return;
  }
  try {
    // DigitalOcean Apps has cert as environment variable but Mongo needs a file path
    // Write Mongo cert file to disk
    if (process.env.CA_CERT) {
      fs.writeFileSync("cert.pem", process.env.CA_CERT);
    }

    await mongoose.connect(mongoConnectionString);
    hasConnection = true;
    console.log("DB connected");
  } catch (err) {
    hasConnection = false;
    console.error("DB Not connected", err);
  }
};

export default connectMongo;

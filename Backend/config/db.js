import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected success to MongoDB ${conn.connection.host}`.bgBlue.white
    );
  } catch (error) {
    console.log(`Error when connect to MongoDB ${error}`.bgRed.white);
  }
};

export default connectDB;

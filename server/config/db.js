const { default: mongoose } = require("mongoose");
const colors = require("colors");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn.connection.readyState === 1) {
      console.log(`DB connection successfully`.bgGreen.white);
    } else {
      console.log(`DB connecting`);
    }
  } catch (error) {
    console.log(`Error when connect to MongoDB `.bgRed.white);
    throw new Error(error);
  }
};

module.exports = dbConnect;

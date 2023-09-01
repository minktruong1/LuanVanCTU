const { default: mongoose } = require("mongoose");
const colors = require("colors");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    if (conn.connection.readyState === 1) {
      console.log(
        `Connected success to MongoDB ${conn.connection.host}`.bgBlue.white
      );
    } else {
      console.log(`DB connecting`);
    }
  } catch (error) {
    console.log(`Error when connect to MongoDB `.bgRed.white);
    throw new Error(error);
  }
};

module.exports = dbConnect;

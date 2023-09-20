/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./public/index.html"],
  theme: {
    fontFamily: {
      main: ["Poppins", "sans-serif"],
    },
    extend: {
      width: {
        main: "1220px",
      },
      backgroundColor: {
        main: "#ea1c00",
        darkRed: "#be1529",
        webBackground: "#ececec",
      },
      color: {
        main: "#ea1c00",
        hoverText: "#e60019",
      },
      backgroundImage: {
        hotDealImg: "url('./assets/hotDealBg.png')",
        topSellerSticker: "url('./assets/topSellerSticker.png')",
        countDownBg: "linear-gradient(rgb(74, 74, 74), rgb(35, 34, 34))",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

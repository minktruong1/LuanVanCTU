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
        overlay: "rgba(0,0,0,0.5)",
        upperHeaderColor: "#e7e7e7",
      },
      color: {
        main: "#ea1c00",
        hoverText: "#e60019",
      },
      backgroundImage: {
        hotDealImg: "url('./assets/hotDealBg.png')",
        upperHeader: "url('./assets/upperHeader.jpg')",
        topSellerSticker: "url('./assets/topSellerSticker.png')",
        countDownBg: "linear-gradient(rgb(74, 74, 74), rgb(35, 34, 34))",
      },
      image: {},
      keyframes: {
        "slide-top-sm": {
          "0%": {
            "-webkit-transform": "translateY(4px);",
            transform: "translateY(4px);",
          },
          "100%": {
            "-webkit-transform": "translateY(0px);",
            transform: "translateY(0px);",
          },
        },
      },
      animation: {
        "slide-top-sm": "slide-top-sm 5s linear both;",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

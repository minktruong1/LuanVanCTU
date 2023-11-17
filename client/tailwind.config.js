/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./public/index.html"],
  theme: {
    fontFamily: {
      main: ["Poppins", "sans-serif"],
    },
    extend: {
      maxWidth: {
        main: "1200px",
      },
      backgroundColor: {
        main: "#e30019",
        darkRed: "#be1529",
        webBackground: "#ECECEC",
        overlay: "rgba(0,0,0,0.5)",
        upperHeaderColor: "#e7e7e7",
      },
      color: {
        main: "#e30019",
        hoverText: "#e60019",
      },
      colors: {
        canClick: "#1982f8",
        main: "#e31b23",
      },
      backgroundImage: {
        hotDealImg: "url('./assets/hotDealBg.png')",
        upperHeader: "url('./assets/upperHeader.jpg')",
        topSellerSticker: "url('./assets/topSellerSticker.png')",
        countDownBg: "linear-gradient(rgb(74, 74, 74), rgb(35, 34, 34))",
      },
      image: {},
      keyframes: {
        "slide-from-left": {
          "0%": {
            "-webkit-transform": "translateX(-100%);",
            transform: "translateX(-100%);",
            opacity: 0,
          },
          "100%": {
            "-webkit-transform": "translateX(0%);",
            transform: "translateX(0%);",
            opacity: 1,
          },
        },
        "slide-from-left-reverse": {
          "100%": {
            "-webkit-transform": "translateX(-100%);",
            transform: "translateX(-100%);",
            opacity: 0,
          },
          "0%": {
            "-webkit-transform": "translateX(0%);",
            transform: "translateX(0%);",
            opacity: 1,
          },
        },

        "drop-down": {
          "0%": {
            "-webkit-transform": "translateY(-100%);",
            transform: "translateY(-100%);",
          },
          "100%": {
            "-webkit-transform": "translateY(0%);",
            transform: "translateY(0%);",
          },
        },
      },
      animation: {
        "slide-from-left": "slide-from-left 0.4s ease both;",
        "slide-from-left-reverse": "slide-from-left-reverse 0.4s ease both;",
        "drop-down": "drop-down 0.4s ease both;",
      },
      flex: {
        1: "1 1 0%",
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
        5: "5 5 0%",
        6: "6 6 0%",
        7: "7 7 0%",
        8: "8 8 0%",
        9: "9 9 0%",
      },
      dropShadow: {
        "4xl": "0 2px 10px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/forms")({ strategy: "class" }),
  ],
};

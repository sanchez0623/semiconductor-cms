/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // 启用深色模式支持
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",   // 如果没 pages 可去掉
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", // 建议加上 lib，有时会在这里定义样式组件
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // 这里可以添加自定义颜色、字体等扩展
    },
  },
  plugins: [
    require("tailwindcss-animate"),      // 激活 shadcn 动画支持
    require("@tailwindcss/typography"),  // 激活 prose 富文本排版支持
  ],
};
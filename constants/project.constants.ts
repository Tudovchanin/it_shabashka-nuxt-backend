import { ProjectStatus } from "../stores/projects.store";




export const STATUS_TRANSLATIONS = {
  [ProjectStatus.NEW]:"Заказ",
  [ProjectStatus.IN_PROGRESS]:"Кодим",
  [ProjectStatus.REVISION]:"Правки",
  [ProjectStatus.REVIEW]:"На проверке",
  [ProjectStatus.DONE]:"Оплачено",
};

export const COLORS_CARD = [
  "red",
  "green",
  "black",
  "white",
  "blue",
  "gold",
  "maroon",
  "orange",
  "linear-gradient(90deg, #e2632c,#fb4955,#ff3286,#fc39be,#d35bf8)",
  "linear-gradient(90deg, #ee6ef5,#57b9ff)",
  "linear-gradient(90deg, #29482a,#4e8950,#9fb97f)",
  "linear-gradient(91deg, #858a86,#a6aab9,#ededed)",
  "linear-gradient(90deg, #000000,#00374a,#008cb4)",
  "linear-gradient(90deg, #f97c15,#fff81f,#fb2dce,#5cd6ff)",
  "linear-gradient(90deg, #990036,#000000,#b30056)",
  "linear-gradient(90deg, #f598a8, #f6edb2)",
];

export const GRADIENT_COLUMN = [
  "linear-gradient(90deg, rgb(95, 224, 211), rgb(255, 119, 137), rgb(255, 222, 58))",
  "linear-gradient(90deg, rgb(32, 21, 94), rgb(123, 104, 238), rgb(255, 255, 255))",
  "linear-gradient(90deg, rgb(234, 242, 143), rgb(205, 232, 181), rgb(255, 242, 213), rgb(247, 250, 219))",
  "linear-gradient(90deg, rgb(210, 205, 198), rgb(8, 166, 147), rgb(58, 77, 95), rgb(39, 44, 63))",
  "linear-gradient(90deg, rgb(136, 0, 21), rgb(249, 208, 122), rgb(202, 51, 5))",
  "linear-gradient(90deg, #e2632c,#fb4955,#ff3286,#fc39be,#d35bf8)",
  "linear-gradient(90deg, #784b21,#935d2a,#c78a52)",

  "linear-gradient(90deg,rgba(0, 0, 0), rgba(35, 11, 16, 0.9), rgba(51, 16, 22, 1), rgba(35, 11, 16), rgba(0, 0, 0))",
  "linear-gradient(180deg, #5c5c5c,#333333,#333333,#000000)",

  "linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%) 0 0 / 20px 20px, linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%) 10px 10px / 20px 20px",

  "linear-gradient(90deg, 	#FFE4C4 50%, rgba(255,0,0,0.6) 50%) 0 0 / 30px 30px, linear-gradient(0deg, transparent 49%, rgba(255,0,0,0.6) 50%) 0 0 / 30px 30px",

  "repeating-linear-gradient( rgba(255, 248, 240, 0.8), rgba(255, 248, 240, 0.8) 50px, rgba(0, 255, 255, .25) 50px, rgba(0, 255, 255, .25) 100px ), repeating-linear-gradient( 90deg, rgba(0, 255, 255, .25), rgba(0, 255, 255, .25) 50px, rgba(255, 248, 240, 0.9) 50px, rgba(255, 248, 240, 0.9) 100px ), repeating-linear-gradient( 135deg, rgba(255, 248, 240, 0.7), rgba(255, 248, 240, 0.7) 4px, rgba(0, 0, 0, .1) 4px, rgba(0, 0, 0, .1) 8px ), repeating-linear-gradient( 45deg, rgba(255, 248, 240, 0.7), rgba(255, 248, 240, 0.7) 4px, rgba(0, 0, 0, .1) 4px, rgba(0, 0, 0, .1) 8px ), repeating-linear-gradient( rgba(255, 248, 240, 0.9), rgba(255, 248, 240, 0.9) 20px, rgba(100, 250, 250, .2) 20px, rgba(100, 250, 250, .2) 21px, rgba(255, 248, 240, 0.9) 21px, rgba(255, 248, 240, 0.9) 29px, rgba(100, 250, 250, .2) 29px, rgba(100, 250, 250, .2) 30px, rgba(255, 248, 240, 0.9) 30px, rgba(255, 248, 240, 0.9) 50px ), repeating-linear-gradient( 90deg, rgba(255, 248, 240, 0.9), rgba(255, 248, 240, 0.9) 20px, rgba(100, 250, 250, .2) 20px, rgba(100, 250, 250, .2) 21px, rgba(255, 248, 240, 0.9) 21px, rgba(255, 248, 240, 0.9) 29px, rgba(100, 250, 250, .2) 29px, rgba(100, 250, 250, .2) 30px, rgba(255, 248, 240, 0.9) 30px, rgba(255, 248, 240, 0.9) 50px )",


  "linear-gradient(90deg, rgba(255,255,255, 0.07) 50%, transparent 50%) 0 0 / 13px,  linear-gradient(90deg, rgba(255,255,255, 0.13) 50%, transparent 50%) 0 0 / 29px,  linear-gradient(90deg, transparent 50%, rgba(255,255,255, 0.17) 50%) 0 0 / 37px,  linear-gradient(90deg, transparent 50%, rgba(255,255,255, 0.19) 50%) 0 0 / 53px, #c00020",


  "linear-gradient(30deg, #80c9dd 12%, transparent 12.5%, transparent 87%, #80c9dd 87.5%, #80c9dd) 0 0 / 40px 70px,    linear-gradient(150deg, #80c9dd 12%, transparent 12.5%, transparent 87%, #80c9dd 87.5%, #80c9dd) 0 0 / 40px 70px,    linear-gradient(30deg, #80c9dd 12%, transparent 12.5%, transparent 87%, #80c9dd 87.5%, #80c9dd) 20px 35px / 40px 70px,    linear-gradient(150deg, #80c9dd 12%, transparent 12.5%, transparent 87%, #80c9dd 87.5%, #80c9dd) 20px 35px / 40px 70px,    linear-gradient(60deg, #d5eaf0 25%, transparent 25.5%, transparent 75%, #d5eaf0 75%, #d5eaf0) 0 0 / 40px 70px,    linear-gradient(60deg, #d5eaf0 25%, transparent 25.5%, transparent 75%, #d5eaf0 75%, #d5eaf0) 20px 35px / 40px 70px, #62bbd3",

  "conic-gradient(from  31deg at 80% 65%,  #be5128  121deg,  #ce9248 0% 50%,  #e4c060 0% 301deg,  #db9c4e  0%)"
];


export const COLORS_COLUMN = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "gray",
  "cyan",
  "magenta",
  "silver",
  "white",
  "HotPink",
  "Chocolate",
];
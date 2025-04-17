
export type ColorKeyTextMap = keyof typeof COLOR_TEXT_MAP;

export const COLOR_TEXT_MAP = {
  'black': "white",
  'maroon': "white",
  'orange': "black",
  'white': "black",
  'red': "black",
  'green': "black",
  'gold': "black",
  'blue': "black",
  'linear-gradient(90deg, #e2632c,#fb4955,#ff3286,#fc39be,#d35bf8)': "white",
  'linear-gradient(90deg, #ee6ef5,#57b9ff)': "black",
  'linear-gradient(90deg, #29482a,#4e8950,#9fb97f)': "white",
  'linear-gradient(91deg, #858a86,#a6aab9,#ededed)': "black",
  'linear-gradient(90deg, #000000,#00374a,#008cb4)': "white",
  'linear-gradient(90deg, #f97c15,#fff81f,#fb2dce,#5cd6ff)': "black",
  'linear-gradient(90deg, #990036,#000000,#b30056)': "white",
  'linear-gradient(90deg, #f598a8, #f6edb2)': "black",

} as const;

export type ColorKeyShadowMap = keyof typeof COLOR_SHADOW_MAP;

export const COLOR_SHADOW_MAP = {
  'black': "black",
  'maroon': "maroon",
  'orange':"orange",
  'white': "white",
  'red': "red",
  'green': "green",
  'gold': "gold",
  'blue': "blue",
  'linear-gradient(90deg, #e2632c,#fb4955,#ff3286,#fc39be,#d35bf8)': "white",
  'linear-gradient(90deg, #ee6ef5,#57b9ff)': 'black',
  'linear-gradient(90deg, #29482a,#4e8950,#9fb97f)': "green",
  'linear-gradient(91deg, #858a86,#a6aab9,#ededed)':'#a6aab9',
  'linear-gradient(90deg, #000000,#00374a,#008cb4)':'#008cb4',
  'linear-gradient(90deg, #f97c15,#fff81f,#fb2dce,#5cd6ff)': '#fff81f',
  'linear-gradient(90deg, #990036,#000000,#b30056)': '#990036',
  'linear-gradient(90deg, #f598a8, #f6edb2)': "#f6edb2",

} as const;


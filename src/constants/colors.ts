export const palettes = {
  light: {
    background: '#F4F7FC', surface: '#FFFFFF', surfaceAlt: '#EAF0F9', text: '#17253F', muted: '#71809A',
    line: '#DCE5F1', primary: '#4B75E8', primaryDark: '#3159C7', accent: '#42C6B3', accentWash: '#E3F7F3',
    gold: '#E6A93B', goldWash: '#FFF4D9', purple: '#9470DC', purpleWash: '#F0EAFE', success: '#238567',
    successWash: '#E4F5EF', danger: '#C84C5C', dangerWash: '#FCEAED', navy: '#172844', white: '#FFFFFF',
  },
  dark: {
    background: '#0D1422', surface: '#151F30', surfaceAlt: '#202C40', text: '#EEF3FF', muted: '#9AA8BE',
    line: '#2B3950', primary: '#83A2FF', primaryDark: '#6688F0', accent: '#55D6C0', accentWash: '#193B3A',
    gold: '#F2C05A', goldWash: '#3B3020', purple: '#B59AF2', purpleWash: '#302643', success: '#6BD1AA',
    successWash: '#19382F', danger: '#FF8791', dangerWash: '#40262D', navy: '#09101C', white: '#FFFFFF',
  },
} as const;

export type Palette = typeof palettes.light | typeof palettes.dark;

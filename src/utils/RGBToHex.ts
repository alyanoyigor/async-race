export const RGBToHex = (rgb: string) => {
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  const rgbArr = rgb.substr(4).split(')')[0].split(sep);

  let r = (+rgbArr[0]).toString(16),
    g = (+rgbArr[1]).toString(16),
    b = (+rgbArr[2]).toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;

  return '#' + r + g + b;
};

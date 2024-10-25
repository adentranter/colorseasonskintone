// File: lib/colorHarmonizer.ts

export type RGB = [number, number, number];
export type HSL = [number, number, number];

export enum Undertone {
  Warm,
  Cool,
  Neutral
}

export interface PersonFeatures {
  hairBlackPoint: number; // 0-255, where 0 is black and 255 is white
  eyeColor: RGB;
  underEyeColor: RGB;
  skinColors: {
    cheeks: RGB;
    neck: RGB;
    nose: RGB;
    underEyes: RGB;
    forehead: RGB;
  };
  lightingType: string;
  undertone: Undertone;
}

export function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function rgbToHex(rgb: RGB): string {
  return "#" + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl(rgb: RGB): HSL {
  let [r, g, b] = rgb.map(x => x / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

export function hslToRgb(hsl: HSL): RGB {
  const [h, s, l] = hsl.map((x, i) => i === 0 ? x / 360 : x / 100);
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function getComplementaryColor(color: RGB): RGB {
  const [h, s, l] = rgbToHsl(color);
  return hslToRgb([(h + 180) % 360, s, l]);
}

function getAnalogousColors(color: RGB, count: number = 2): RGB[] {
  const [h, s, l] = rgbToHsl(color);
  const analogous: RGB[] = [];
  for (let i = 1; i <= count; i++) {
    analogous.push(hslToRgb([(h + 30 * i) % 360, s, l]));
  }
  return analogous;
}

export function harmonizeColors(features: PersonFeatures): string[] {
  const baseColors: RGB[] = [
    features.eyeColor,
    features.underEyeColor,
    features.skinColors.cheeks,
    features.skinColors.neck,
    features.skinColors.nose,
    features.skinColors.underEyes,
    features.skinColors.forehead
  ];

  const harmonizedColors: Set<string> = new Set();

  const depth = features.hairBlackPoint < 85 ? "deep" : features.hairBlackPoint < 170 ? "medium" : "light";

  baseColors.forEach(color => {
    const [h, s, l] = rgbToHsl(color);
    let adjustedH = h;
    let adjustedS = s;
    let adjustedL = l;

    switch (features.undertone) {
      case Undertone.Warm:
        adjustedH = (h + 15) % 360;
        adjustedS = Math.min(s * 1.1, 100);
        break;
      case Undertone.Cool:
        adjustedH = (h - 15 + 360) % 360;
        adjustedS = Math.max(s * 0.9, 0);
        break;
    }

    switch (depth) {
      case "deep":
        adjustedL = Math.max(l * 0.9, 0);
        break;
      case "light":
        adjustedL = Math.min(l * 1.1, 100);
        break;
    }

    const adjustedColor = hslToRgb([adjustedH, adjustedS, adjustedL]);
    harmonizedColors.add(rgbToHex(adjustedColor));

    harmonizedColors.add(rgbToHex(getComplementaryColor(adjustedColor)));
    getAnalogousColors(adjustedColor, 2).forEach(c => harmonizedColors.add(rgbToHex(c)));
  });

  const [eyeH, eyeS, eyeL] = rgbToHsl(features.eyeColor);
  const accentColors = [
    hslToRgb([(eyeH + 120) % 360, eyeS, eyeL]),
    hslToRgb([(eyeH + 180) % 360, eyeS, eyeL])
  ];
  accentColors.forEach(c => harmonizedColors.add(rgbToHex(c)));

  return Array.from(harmonizedColors);
}

// Export a function to determine undertone based on answers
export function determineUndertone(veinTest: 'A' | 'B' | 'C', jewelryTest: 'A' | 'B' | 'C', beachTest: 'A' | 'B' | 'C'): Undertone {
  const scores = { A: 0, B: 0, C: 0 };
  scores[veinTest]++;
  scores[jewelryTest]++;
  scores[beachTest]++;

  if (scores.A > scores.B && scores.A > scores.C) return Undertone.Warm;
  if (scores.B > scores.A && scores.B > scores.C) return Undertone.Cool;
  return Undertone.Neutral;
}
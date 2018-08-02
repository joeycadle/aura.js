export class aura {
  static darken(col, perc) {
    const { r, g, b } = this._alter(col, perc, true);
    return this._shade(
      this._normalize(r),
      this._normalize(g),
      this._normalize(b)
    );
  }

  static lighten(col, perc) {
    const { r, g, b } = this._alter(col, perc);
    return this._shade(
      this._normalize(r),
      this._normalize(g),
      this._normalize(b)
    );
  }

  static fade(col, amt) {
    if (col.substring(0, 3) === 'rgb') {
      return col
        .replace('rgb', 'rgba')
        .replace(')', `,${amt})`)
    }

    const { r, g, b } = this._hexToRgb(col);
    return `rgba(${r},${g},${b},${amt})`;
  }

  static _alter(col, perc, darken = false) {
    col = col[0] === '#' ? col.slice(1) : col;
    col = col.length < 6 ? this._expand(col) : col;
    const num = parseInt(col, 16);
    let amt = Math.round(2.55 * perc);
    amt = darken ? 0 - amt : amt;

    return {
      r: (num >> 16) + amt,
      g: (num & 0x0000FF) + amt,
      b: ((num >> 8) & 0x00FF) + amt
    };
  }

  static _normalize(spectrum) {
    return spectrum > 255 ? 255 : spectrum < 0 ? 0 : spectrum;
  }

  static _shade(r, g, b) {
    const hex = `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    return hex === '#0' ? '#000000' : hex;
  }

  static _expand(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    return hex.replace(shorthandRegex, (m, r, g, b) => {
        return `${r}${r}${g}${g}${b}${b}`;
    });
  }

  static _hexToRgb(hex) {
    hex = hex.length < 6 ? this._expand(hex) : hex;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }
}
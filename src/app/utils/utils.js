export const convertHexToRGB = (hex) => {
    // Check if it's a valid hex code
    if (hex.match('^#([A-Fa-f0-9]{3}){1,2}$')) {
      let c = hex.substring(1).split('');
      
      // Convert 3-digit hex to 6-digit (e.g., #000 -> #000000)
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      
      c = '0x' + c.join('');
      
      // Parse to RGB
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
    }
    
    // Return original if it's not a hex or already valid
    return hex;
  };
  
  export const debounce = (func, wait, immediate) => {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  };
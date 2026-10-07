const fs = require('fs');
const css = fs.readFileSync('src/index.css', 'utf8');
console.log(css.includes('.admin-mobile-menu-btn'));

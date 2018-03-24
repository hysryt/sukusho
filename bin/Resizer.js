const jimp = require('jimp');

class Resizer {
  constructor(filepath, width) {
    this.filepath = filepath;
    this.width = width;
  }

  resize() {
    jimp.read(this.filepath).then((img) => {
      console.log('Resizing...');

      img.resize(this.width, jimp.AUTO).write(this.filepath);

      console.log('Resize OK.');
    });
  }
}

module.exports = Resizer;
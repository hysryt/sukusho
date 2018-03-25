const Resizer = require('./Resizer.js');

class Screenshoter {
  constructor(page, viewports) {
    this.page = page;
    this.viewports = viewports;

    this.defaultViewport = {
      'device-width': 1000,
      'device-height': 700,
      'dpr': 1,
    }
  }

  async screenshot(target) {
    console.log('🚀 Accessing...');
    await this.page.goto(target.url);
    console.log('Access OK.');

    await this.addDebugMarkToPage();

    // forEach() では await がうまく動作しないため for で処理する
    const viewportNames = Object.keys(this.viewports);
    for (let i = 0; i < viewportNames.length; i++) {
      const viewportName = viewportNames[i];
      const viewport = this.viewports[viewportName];

      await this.screenshotViewport(target, viewportName, viewport);

      // 必要に応じてリサイズ処理を行う
      if (viewport['save-width']) {
        const filename = this.createFilename(viewportName, target);
        const resizer = new Resizer(filename, viewport['save-width']);
        resizer.resize();
      }
    }
  }

  async addDebugMarkToPage() {
    await this.page.evaluate(() => {
      document.querySelector('html').classList.add('___debug');
    });
  }

  async screenshotViewport(target, viewportName, viewport) {
    console.log('📸 Capturing ' + target.name + ' [' + viewportName + '] ...');
      
    await this.setViewportToPage(viewport);
    await this.page.screenshot({
      'path': this.createFilename(viewportName, target),
      'type': target.type,
      'fullPage': true,
    });

    console.log('Capture OK.');
  }

  async setViewportToPage(viewport) {
    const v = Object.assign({}, this.defaultViewport, viewport);

    await this.page.setViewport({
      'width': v['device-width'],
      'height': v['device-height'],
      'deviceScaleFactor': v['dpr']
    });

    // 必要に応じて UserAgent を変更しページを更新する
    if (v['user-agent']) {
      await this.page.setUserAgent(v['user-agent']);
      await this.page.reload();
    }
  }

  createFilename(viewportName, target) {
    return target.name + '_' + viewportName + '.' + target.type;
  }
}

module.exports = Screenshoter;
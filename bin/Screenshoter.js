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
    await this.access(target.url);

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

  async access(url) {
    console.log('🚀 Accessing...');

    await this.page.goto(url);

    console.log('Access OK.');
  }

  async addDebugMarkToPage() {
    await this.page.evaluate(() => {
      document.querySelector('html').classList.add('___debug');
    });
  }

  /**
   * 高さを固定する。
   * 高さ指定に vh が使われているとうまくスクリーンショットが取れないため、全て固定値に変換。
   */
  async finalizeElementHeight() {
    await this.page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.height = elements[i].offsetHeight + 'px'
      }
    });
  }

  async screenshotViewport(target, viewportName, viewport) {
    console.log('📸 Capturing ' + target.name + ' [' + viewportName + '] ...');
      
    await this.setViewportToPage(viewport);

    await this.addDebugMarkToPage();
    await this.finalizeElementHeight();

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

    if (v['user-agent']) {
      await this.page.setUserAgent(v['user-agent']);
    }

    await this.page.reload();
  }

  createFilename(viewportName, target) {
    let extension = target.type;

    if (extension === 'jpeg') {
      extension = 'jpg';
    }

    return target.name + '_' + viewportName + '.' + extension;
  }
}

module.exports = Screenshoter;
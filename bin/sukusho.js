#!/usr/bin/env node

const CONF_FILENAME = 'sukusho.json';
const DEFAULT_CONF_FILENAME = 'sukusho.default.json';

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const Screenshoter = require('./Screenshoter.js');

class SukushoError extends Error {}

class Sukusho {
  /**
   * sukusho.default.json と 実行ファイルパスの suskusho.json から設定値を取得
   * sukusho.default.json の値を sukusho.json で上書きする
   */
  loadConfig() {
    const defaultConfig = require(path.join(__dirname, DEFAULT_CONF_FILENAME));
    const config = this.loadUserConfig();
  
    return Object.assign({}, defaultConfig, config);
  }

  loadUserConfig() {
    try {
      return require(path.join(process.cwd(), CONF_FILENAME));
    } catch(e) {
      throw new SukushoError('sukusho.json がない、または不正です。');
    }
  }
  
  async screenshot() {
    const config = this.loadConfig();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    const screenshoter = new Screenshoter(page, config.viewports);
  
    // forEach() では await がうまく動作しないため for で処理する
    for (let i = 0; i < config.targets.length; i++) {
      await screenshoter.screenshot(config.targets[i]);
    }
  
    await browser.close();
  }
}


(async () => {
  try {
    const sukusho = new Sukusho();
    sukusho.screenshot();

  } catch(e) {
    if (e instanceof SukushoError) {
      console.log(e.message);
    } else {
      console.log(e);
    }
  } 
})();

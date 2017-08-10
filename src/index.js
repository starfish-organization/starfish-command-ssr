import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import glob from 'glob';

import 'zone.js/dist/zone-node';

import { renderModuleFactory } from '@angular/platform-server';

export default class StarFishCommandSSr {
  constructor() {
    this.name = 'ssr';
    this.type = 'command';
  }

  run(inputs, flags) {
    const inputPath = path.resove(inputs[0]);
    if (!fs.statSync(inputPath).isDirectory()) {
      throw new Error('input path is not a directory');
    }
    if (!fs.statSync(path.join(inputPath, 'config.yaml')).isFile()) {
      throw new Error('config.yaml file not found');
    }

    const starfishConfigure = yaml.safeLoad(path.join(inputPath, 'config.yaml'), 'utf8');
    const themePath = path.join(
      inputPath,
      starfishConfigure.STYLE.THEMEDIR,
      starfishConfigure.STYLE.THEME
    );

    const ngFactoryFilePath = fs
      .readdirSync(path.join(themePath, './dist-server/'))
      .filter(name => /^main.+.bundle.js$/.test(name))[0];

    const AppServerModuleNgFactory = require(path.join(
      themePath,
      './dist-server/',
      ngFactoryFilePath
    )).AppServerModuleNgFactory;
  }
}

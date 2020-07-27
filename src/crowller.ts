// ts -> .d.ts  翻译文件 -> js
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import cnodeAnalyzer from './cnodeAnalyzer';
import CnodeAnalyzer from './cnodeAnalyzer';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/article.json');

  private async getRawHtml() {
    const result = await superagent.get(this.url);

    return result.text;
    // this.getJsonInfo(result.text);
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content, 'utf-8');
  }

  private async initProcess() {
    const text: string = await this.getRawHtml();
    const articlesJSON = this.analyzer.analyze(text, this.filePath);
    this.writeFile(articlesJSON);
  }

  constructor(private url: string, private analyzer: Analyzer) {
    this.initProcess();
  }
}

const url = `https://cnodejs.org/`;
const analyzer = CnodeAnalyzer.getInstance();

new Crowller(url, analyzer);

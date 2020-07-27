import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crowller';

interface Articles {
  time: number;
  data: Article[];
}

interface jsonData {
  [propName: number]: Article[];
}

interface Article {
  title: string;
  visit: number;
}

export default class CnodeAnalyzer implements Analyzer {
  private static instance: CnodeAnalyzer;

  static getInstance() {
    if (!CnodeAnalyzer.instance) {
      CnodeAnalyzer.instance = new CnodeAnalyzer();
    }

    return CnodeAnalyzer.instance;
  }

  private getArticlesInfo(html: string) {
    const $ = cheerio.load(html);
    const cells = $('.cell');

    const countInfos: Article[] = [];

    cells.map((index, element) => {
      const visit = parseInt(
        $(element).find('.count_of_visits').eq(0).text().trim(),
        10
      );
      const title = $(element).find('.topic_title').eq(0).text().trim();

      countInfos.push({
        title,
        visit,
      });
    });

    const result = {
      time: new Date().getTime(),
      data: countInfos,
    };

    return result;
  }

  private generataJsonData(data: Articles, filePath: string) {
    let jsonData: jsonData = {};
    if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf-8')) {
      jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    jsonData[data.time] = data.data;
    return jsonData;
  }

  public analyze(html: string, filePath: string) {
    const articleInfo = this.getArticlesInfo(html);
    const articlesJSON = this.generataJsonData(articleInfo, filePath);

    return JSON.stringify(articlesJSON);
  }

  private constructor() {}
}

// ts -> .d.ts  翻译文件 -> js
import superagent from 'superagent'
import cheerio from 'cheerio'

interface Article {
	title: string;
	visit: number;
}

class Crowller {
	private secret = 'secretKey';
	private url = `https://cnodejs.org/`;

	getJsonInfo(html: string) {
		const $ = cheerio.load(html);
		const cells = $('.cell');

		const countInfos: Article[] = [];


		cells.map((index, element) => {
			const visit = parseInt($(element).find('.count_of_visits').eq(0).text().trim(), 10)
			const title = $(element).find('.topic_title').eq(0).text().trim()

			countInfos.push({
				title, visit
			})
		})

		const result = {
			time: (new Date).getTime(),
			data: countInfos
		}

		console.log(result)
		
	};

	async getRawHtml() {
		const result = await superagent.get(this.url);
		
		this.getJsonInfo(result.text)
	};

	constructor() {
		this.getRawHtml();
	}
} 

const crowller = new Crowller()
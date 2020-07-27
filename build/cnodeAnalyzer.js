"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var cheerio_1 = __importDefault(require("cheerio"));
var CnodeAnalyzer = /** @class */ (function () {
    function CnodeAnalyzer() {
    }
    CnodeAnalyzer.getInstance = function () {
        if (!CnodeAnalyzer.instance) {
            CnodeAnalyzer.instance = new CnodeAnalyzer();
        }
        return CnodeAnalyzer.instance;
    };
    CnodeAnalyzer.prototype.getArticlesInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var cells = $('.cell');
        var countInfos = [];
        cells.map(function (index, element) {
            var visit = parseInt($(element).find('.count_of_visits').eq(0).text().trim(), 10);
            var title = $(element).find('.topic_title').eq(0).text().trim();
            countInfos.push({
                title: title,
                visit: visit,
            });
        });
        var result = {
            time: new Date().getTime(),
            data: countInfos,
        };
        return result;
    };
    CnodeAnalyzer.prototype.generataJsonData = function (data, filePath) {
        var jsonData = {};
        if (fs_1.default.existsSync(filePath) && fs_1.default.readFileSync(filePath, 'utf-8')) {
            jsonData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        jsonData[data.time] = data.data;
        return jsonData;
    };
    CnodeAnalyzer.prototype.analyze = function (html, filePath) {
        var articleInfo = this.getArticlesInfo(html);
        var articlesJSON = this.generataJsonData(articleInfo, filePath);
        return JSON.stringify(articlesJSON);
    };
    return CnodeAnalyzer;
}());
exports.default = CnodeAnalyzer;

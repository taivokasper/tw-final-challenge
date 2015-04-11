package app

import grails.transaction.Transactional
import yahoofinance.Stock
import yahoofinance.YahooFinance
import yahoofinance.histquotes.Interval

@Transactional
class StatsService {
    def String[] supportedStocks = ["VTI"]

    def Map<String, Stock> cache = new HashMap<>()

    def getForStock(String stockName) {
        cache.get(stockName)
    }

    def updateCache() {
        cache = YahooFinance.get(supportedStocks)
    }

    def getHistoricalFromTo(String stockSymbol, int yearsOfData) {
        Calendar from = Calendar.getInstance();
        Calendar to = Calendar.getInstance();
        from.add(Calendar.YEAR, yearsOfData * -1);

        Stock google = YahooFinance.get(stockSymbol);
        google.getHistory(from, to, Interval.DAILY);
    }
}

package app

class PollStockPricesJob {
    static triggers = {
      simple repeatInterval: 1000l // execute job once in 5 seconds
    }

    def statsService

    def execute() {
        statsService.updateCache()
        log.info("Stock prices updated")
    }
}

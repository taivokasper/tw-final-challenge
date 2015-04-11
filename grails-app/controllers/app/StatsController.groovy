package app
import grails.converters.JSON

class StatsController {
    def statsService

    def stockStats() {
        render statsService.getForStock(params.get("id")) as JSON
    }

    def graphStats() {
        render statsService.getHistoricalFromTo("VTI", params.int("id")) as JSON
    }
}

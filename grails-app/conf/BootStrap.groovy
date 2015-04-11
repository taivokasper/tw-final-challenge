import app.User
import grails.converters.JSON
import yahoofinance.histquotes.HistoricalQuote

class BootStrap {

    def calendarToDate(Calendar c) {
        return new Date(c.timeInMillis)
    }

    def init = { servletContext ->
        registerMarshallers()

        if(User.count() == 0) {
            new User(name: "Esimene", description: "The very first person", age: 10).save(failOnError: true)
            new User(name: "Teine", description: "The very second person", age: 20).save(failOnError: true)
            new User(name: "Kolmas", description: "The very third person", age: 30).save(failOnError: true)
            new User(name: "Neljas", description: "The very fourth person", age: 40).save(failOnError: true)
        }
    }

    private void registerMarshallers() {
        JSON.registerObjectMarshaller(Calendar) { Calendar calendar ->
            return calendarToDate(calendar)
        }
        JSON.registerObjectMarshaller(HistoricalQuote) { HistoricalQuote hq ->
            return [
                    symbol  : hq.symbol,
                    date    : calendarToDate(hq.date),
                    open    : hq.open,
                    low     : hq.low,
                    high    : hq.high,
                    close   : hq.close,
                    adjClose: hq.adjClose,
                    volume  : hq.volume
            ]
        }
    }

    def destroy = {
    }

}
import app.auth.Role
import app.auth.User
import app.auth.UserRole
import grails.converters.JSON
import yahoofinance.histquotes.HistoricalQuote

class BootStrap {

    def calendarToDate(Calendar c) {
        return new Date(c.timeInMillis)
    }

    def init = { servletContext ->
        registerMarshallers()

        User user = new User(username: "test", password: "test")
        user.save()

        Role roleUser = new Role(authority: "ROLE_USER")
        roleUser.save()

        new UserRole(user: user, role: roleUser).save()
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
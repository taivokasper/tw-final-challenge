import app.auth.Role
import app.auth.User
import app.auth.UserRole
import grails.converters.JSON
import org.joda.time.LocalDate
import yahoofinance.histquotes.HistoricalQuote

class BootStrap {

    def calendarToDate(Calendar c) {
        return new Date(c.timeInMillis)
    }

    def init = { servletContext ->
        registerMarshallers()
        addTestUser()
    }

    private void addTestUser() {
        User user = new User(username: "test@test.ee", email: "test@test.ee", password: "test", fullName: "Test User", dateOfBirth: LocalDate.parse("1991-02-01"))
        if (User.findByEmail("test@test.ee") != null) {
            user.save()

            Role roleUser = new Role(authority: "ROLE_USER")
            roleUser.save()

            new UserRole(user: user, role: roleUser).save()
        }
    }

    private void registerMarshallers() {
        JSON.registerObjectMarshaller(Calendar) { Calendar calendar ->
            return calendarToDate(calendar)
        }
        JSON.registerObjectMarshaller(HistoricalQuote) { HistoricalQuote hq ->
            return [
                    date    : calendarToDate(hq.date),
                    open    : hq.open
            ]
        }
    }

    def destroy = {
    }

}
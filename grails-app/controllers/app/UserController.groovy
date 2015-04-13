package app
import app.auth.User
import grails.converters.JSON
import grails.validation.ValidationException
import org.joda.time.LocalDate

class UserController {

    def userService

    def add() {
        try {
            def user = new User(
                    fullName: request.JSON["fullName"],
                    username: request.JSON["username"],
                    email: request.JSON["username"],
                    password: request.JSON["password"],
                    dateOfBirth: new LocalDate(request.JSON["dateOfBirth"])
            )
            render userService.addNewUser(user) as JSON
        } catch (ValidationException e) {
            if (e.getMessage().contains("must be unique")) {
                render(status: 400, text: request.JSON["username"] + " is already registered as a user!")
            } else {
                throw e
            }
        }
    }
}

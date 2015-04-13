package app

import app.auth.User
import grails.transaction.Transactional

@Transactional
class UserService {

    def addNewUser(User user) {
        user.save(flush: true, failOnError: true)
    }
}

package app

import grails.transaction.Transactional

@Transactional
class UserService {

    def getAllUsers() {
        User.list()
    }

    def addUser(User user) {
        user.save(flush: true, failOnError: true)
    }

    def getById(Long id) {
        User.get(id)
    }

    def edit(Long id, newVals) {
        def u = User.get(id)
        u.setProperties(newVals)
        u.save()
    }

    def deleteById(Long id) {
        def user = User.get(id)
        user.delete(flush: true, failOnError: true)
        user
    }
}

package app

import grails.converters.JSON

class AnonymousUserController {

    def anonymousUserService

    def addUserActivity() {
        def anonymousUser = anonymousUserService.addActivity(params.get("id"), request.JSON["activity"])
        render anonymousUser as JSON
    }

    def generateId() {
        def uuid = UUID.randomUUID().toString()
        render new AnonymousUser(uuid: uuid).save(flush: true, failOnError: true) as JSON
    }
}

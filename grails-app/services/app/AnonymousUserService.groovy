package app

import grails.converters.JSON
import grails.transaction.Transactional

@Transactional
class AnonymousUserService {

    def addActivity(String uuid, String activityDesc) {
        AnonymousUser anonymousUser = AnonymousUser.findByUuid(uuid)
        if (anonymousUser == null) {
            anonymousUser = createWithUuid(uuid)
        }

        anonymousUser.addToActivities(new Activity(activity: activityDesc))

        anonymousUser.save(flush: true, failOnError: true)
    }

    def create() {
        createWithUuid(UUID.randomUUID().toString())
    }

    def createWithUuid(String uuid) {
        new AnonymousUser(uuid: uuid).save(flush: true, failOnError: true)
    }
}

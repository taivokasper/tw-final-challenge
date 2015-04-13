package app

import grails.transaction.Transactional

@Transactional
class AnonymousUserService {

    def addActivity(String uuid, String activityDesc) {
        AnonymousUser anonymousUser = AnonymousUser.findByUuid(uuid)
        anonymousUser.addToActivities(new Activity(activity: activityDesc))

        anonymousUser.save(flush: true, failOnError: true)
    }
}

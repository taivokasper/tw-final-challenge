package app

class Activity {
    Date activityDate = new Date();
    String activity;

    // Mappings
    static belongsTo = [
            anonymousUser : AnonymousUser
    ]

    AnonymousUser anonymousUser

    static constraints = {
        activityDate blank: false
        activity blank: false
    }
}

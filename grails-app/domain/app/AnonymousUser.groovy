package app

class AnonymousUser {
    String uuid;
    Date dateCreated = new Date()

    // Mappings
    static hasMany = [
            activities : Activity
    ]

    List activities = new ArrayList<>();

    static constraints = {
        uuid blank: false, unique: true
    }
}

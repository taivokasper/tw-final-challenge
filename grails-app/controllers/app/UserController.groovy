package app

import grails.converters.JSON

class UserController {

    def userService

    def index() {
        render userService.getAllUsers() as JSON
    }

    def save() {
        def user = userService.addUser(new User(request.JSON))
        render user as JSON
    }

    // Unused - left for sample
    def show() {
        render userService.getById(params.long("id")) as JSON
    }

    // Unused - left for sample
    def edit() {
        render userService.getById(params.long("id")) as JSON
    }

    def update() {
        render userService.edit(params.long("id"), request.JSON) as JSON
    }

    def delete() {
        render userService.deleteById(params.long("id")) as JSON
    }
}

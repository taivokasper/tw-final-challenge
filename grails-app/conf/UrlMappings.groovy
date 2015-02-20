class UrlMappings {

	static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(uri:"/index.html")
        "/users"(resources:'user')
        "500"(view:'/error')
	}
}

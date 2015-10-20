//This file generated from url_map.json
//The idea behind this is to force backend generate url_map.json
//with all the routes for the REST api
//This will prevent problem with routws changes

angular.module("app.config.url_map", [])

.constant("urlMap", {
	"user": "/user/:id"
})

;
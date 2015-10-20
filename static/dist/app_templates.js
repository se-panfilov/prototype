angular.module("app.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("users/users.html","<main-header></main-header><div class=\"page_content users_page\"><div class=container><h3>Users</h3><ul><li ng-repeat=\"user in usersList track by $index\"><span ng-bind=$index class=user_index></span><span ng-bind=user.name></span><button type=button ng-click=actions.removeUser() class=\"btn btn-link remove_btn\"></button></li></ul><button type=submit ng-click=actions.addUser() class=\"btn btn-success\"><i class=\"fa fa-plus\"></i>&nbsp; Add</button></div></div>");
$templateCache.put("users/add_users_modal/add_users_modal.html","<div class=add_user_modal><div class=modal-header><h3 class=modal-title>Add user</h3></div><div class=modal-body><form id=add_user_form name=add_user_form><div class=input-group><label for=user_name class=\"label_min_width_small input-group-addon\">Name</label><input id=user_name type=text name=user_name ng-model=user.name class=form-control></div></form></div><div class=modal-footer><button ng-click=cancel() class=\"btn btn-default pull_left\">Cancel</button><button type=submit ng-disabled=add_user_form.$invalid ng-click=add() class=\"btn btn-success\"><i class=\"fa fa-plus\"></i>&nbsp; Add</button></div></div>");
$templateCache.put("other/other.html","<main-header></main-header><div class=\"page_content other_page\"><div class=container><h3>Some other page</h3></div></div>");
$templateCache.put("users/remove_users_modal/remove_users_modal.html","<div class=remove_user_modal><div class=modal-header><h3 class=modal-title>Remove user</h3></div><div class=modal-body><div class=normal_modal_body><span ng-bind=::user.name></span></div></div><div class=modal-footer><button type=button ng-click=cancel() class=\"btn btn-default pull_left\">Cancel</button><button type=submit ng-click=remove() class=\"btn btn-danger\"><i class=\"fa fa-trash-o\"></i>&nbsp; Remove</button></div></div>");
$templateCache.put("header/header.html","<div class=\"navbar navbar-default pages_header\"><div class=container><ul class=\"nav navbar-nav\"><li ng-class=\"{active: $state.includes(\'users\')}\"><a href=\"\" ui-sref=users ui-sref-opts=\"{reload: true}\">Users</a></li><li ng-class=\"{active: $state.includes(\'other\')}\"><a href=\"\" ui-sref=other ui-sref-opts=\"{reload: true}\">Other</a></li></ul></div></div>");}]);
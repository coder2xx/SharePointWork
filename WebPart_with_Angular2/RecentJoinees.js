var Apps = window.Apps || {};

Apps.RecentJoinees = Apps.RecentJoinees || {};

Apps.RecentJoinees.Services = Apps.RecentJoinees.Services || {};

Apps.RecentJoinees.Services.GetService = function () {

    this.getRecentJoinees = function () {

        var days = 7;

        var today = new Date();
        var pastDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));

        var listName = "Employee Master";

        var URL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?" +
                "$select=Id,Name,Display_Picture,Email,Date_Of_Joining,Location" +
                "&$filter=(Date_Of_Joining ge datetime'" + pastDate.toISOString() + "') and (Date_Of_Joining le datetime'" + today.toISOString() + "')";

        var defObj = new $.Deferred();
        {
            $.ajax({

                url: URL,

                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },

                success: function (data) {

                    var results = data.d.results;
                    var RecentJoinees = [];

                    for (i = 0; i < results.length; i++) {

                        var employee = {};
                        employee.ID = results[i].ID;
                        employee.Name = results[i].Name;
                        employee.Email = results[i].Email;
                        employee.Date_Of_Joining = new Date(results[i].Date_Of_Joining).toDateString();
                        employee.Location = results[i].Location;
                        employee.Display_Picture_Url = results[i].Display_Picture.Url + "?RenditionID=1";
                        RecentJoinees.push(employee);
                    }

                    defObj.resolve(RecentJoinees);
                },
                error: function (data) {

                    debugger
                    failure(data);
                    defObj.reject();
                }
            });
        }
        return defObj.promise();
    }
}

Apps.RecentJoinees.App = function (GetService) {

    var thisApp = this;

    thisApp.recentJoinees = [];

    thisApp.index = 0;

    thisApp.current = {
        ID: "",
        Name: "",
        Email: "",
        Date_Of_Joining: "",
        Location: "",
        Display_Picture_Url: ""
    }

    GetService.getRecentJoinees().then(function (NewJoineesList) {

        thisApp.recentJoinees = NewJoineesList;

        if (thisApp.recentJoinees.length > 0) {

            thisApp.index = 0;
            thisApp.current = thisApp.recentJoinees[0];
        }
        else {

            thisApp.index = 0;
            thisApp.current = "";
        }

        setInterval(thisApp.onNextClick, 7000);
    });

    thisApp.onNextClick = function () {

        var numDivs = $('[prnt="recentJoinee"]').length;

        $('[prnt="recentJoinee"]').fadeOut(250, function () {

            if (--numDivs > 0) return;

            if (thisApp.recentJoinees.length > 0) {

                if (thisApp.index == thisApp.recentJoinees.length - 1) {

                    thisApp.index = 0;
                }
                else {

                    thisApp.index += 1;
                }
                thisApp.current = thisApp.recentJoinees[thisApp.index];
            }
            $('[prnt="recentJoinee"]').fadeIn(250);
        });
    }

    thisApp.onPrvsClick = function () {

        var numDivs = $('[prnt="recentJoinee"]').length;

        $('[prnt="recentJoinee"]').fadeOut(500, function () {

            if (--numDivs > 0) return;

            if (thisApp.recentJoinees.length > 0) {

                if (thisApp.index == 0) {

                    thisApp.index = thisApp.recentJoinees.length - 1;
                }
                else {

                    thisApp.index -= 1;
                }
                thisApp.current = thisApp.recentJoinees[thisApp.index];
            }
            $('[prnt="recentJoinee"]').fadeIn(500);
        });
    }
}

Apps.RecentJoinees.App.annotations = [

    new angular.ComponentAnnotation({

        selector: 'recentJoinees',
        appInjector: [Apps.RecentJoinees.Services.GetService]

    }),
    new angular.ViewAnnotation({

        template: '<div class="col-xs-12 col-sm-12 col-md-12" id="dvNewJoinee">' +
			        '<div class="width:100%"><h4>' +
			        '<span class="glyphicon glyphicon-user" aria-hidden="true"></span> Recent Joinees </h4></div>' +
	                '<div class="col-xs-12 col-sm-5 col-md-5" style="padding-bottom:10px;">' +
		                '<img src="{{ current.Display_Picture_Url }}" prnt="recentJoinee">' +
	                '</div>' +
	                '<div class="col-xs-12 col-sm-7 col-md-7" style="">' +
		                '<h5 prnt="recentJoinee">{{ current.Name }}</h5>' +
		                '<h6 prnt="recentJoinee">{{ current.Date_Of_Joining }}</h6>' +
		                '<h6 prnt="recentJoinee">{{ current.Location }}</h6>' +
		                '<div class="input-group">' +
							'<a href="mailto:{{ current.Email }}?&subject=WELCOME ON BOARD&body=Wish you better future ahead!" target="_top">Welcome in mail</a>' +
						'</div>' +
					'</div>' +
                '</div>',

        directives: [angular.NgFor]
    })
];

Apps.RecentJoinees.App.parameters = [[Apps.RecentJoinees.Services.GetService]];

$(document).ready(function () {

    angular.bootstrap(Apps.RecentJoinees.App);
});

// JavaScript source code

//namespace 
var eZest= window.eZest || {};

eZest.ngApps.homePageApps.highlightsOfWeek = window.eZest.ngApps.homePageApps.highlightsOfWeek || {};

highlightsOfWeek .Services = highlightsOfWeek .Services || {};

highlightsOfWeek .Services.GetBirthdaysService = function () {

    this.getnewjoinees = function (fromDate, toDate) {

        var listName = "Employee Master";

        var URL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/GetItems(query=@qry)?@qry={\"ViewXml\":\"" +
        "<View><Query><Where><And>" +
        "<Leq><FieldRef Name='Cal_DOB' /><Value Type='DateTime'>" + fromDate.toISOString() + "</Value></Leq>" +
        "<Geq><FieldRef Name='Cal_DOB' /><Value Type='DateTime'>" + toDate.toISOString() + "</Value></Geq>" +
        "</And></Where></Query></View>\"}";

        var defObj = new $.Deferred();
        {
            $.ajax({

                url: URL,

                method: "POST",
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "Content-Type": "application/json; odata=verbose"
                },

                success: function (data) {

                    var results = data.d.results;
                    var Birthdays = [];

                    for (i = 0; i < results.length; i++) {

                        var employee = {};
                        employee.ID = results[i].ID;
                        employee.Name = results[i].Name;
                        employee.Email = results[i].Email;
                        employee.Date_Of_Birth = new Date(results[i].Date_Of_Birth).toDateString();
                        employee.Location = results[i].Location;
                        employee.Display_Picture_Url = results[i].Display_Picture.Url;
                        Birthdays.push(employee);
                    }

                    defObj.resolve(Birthdays);
                },
                error: function (data) {

                    debugger
                    failure(data);
                    defObj.reject();
                }
            });
            return defObj.promise();
        }
    }
}

highlightsOfWeek .EmployeeBirthday = function (Birthdays) {

    this.index = 0;
    this.current = {
        ID: "",
        Name: "loading...",
        Email: "",
        Date_Of_Birth: "loading...",
        Location: "loading...",
        Display_Picture_Url: ""
    }

    this.newJoinees = [];

    var thisFunc = this;

    var pastDays = 7;
    var today = new Date();
    today.setFullYear(2000);

    var pastDate = new Date(today.getTime() - (pastDays * 24 * 60 * 60 * 1000));

    Birthdays.getnewjoinees(today, pastDate).then(function (NewJoineesList) {

        thisFunc.newJoinees = NewJoineesList;

        if (thisFunc.newJoinees.length > 0) {

            thisFunc.index = 0;
            thisFunc.current = thisFunc.newJoinees[0];
        }
        else {

            thisFunc.index = 0;
            thisFunc.current = "";
        }

        //setInterval(thisFunc.onNextClick, 7000);
    });

    this.onNextClick = function () {

        var numDivs = $('[prnt="empbirthday"]').length;

        $('[prnt="empbirthday"]').fadeOut(500, function () {

            if (--numDivs > 0) return;

            if (thisFunc.newJoinees.length > 0) {

                if (thisFunc.index == thisFunc.newJoinees.length - 1) {

                    thisFunc.index = 0;
                }
                else {

                    thisFunc.index += 1;
                }
                thisFunc.current = thisFunc.newJoinees[thisFunc.index];
            }
            $('[prnt="empbirthday"]').fadeIn(500);
        });
    }

    this.onPrvsClick = function () {

        var thisFunc = this;
        var numDivs = $('[prnt="empbirthday"]').length;

        $('[prnt="empbirthday"]').fadeOut(500, function () {

            if (--numDivs > 0) return;

            if (thisFunc.newJoinees.length > 0) {

                if (thisFunc.index == 0) {

                    thisFunc.index = thisFunc.newJoinees.length - 1;
                }
                else {

                    thisFunc.index -= 1;
                }
                thisFunc.current = thisFunc.newJoinees[thisFunc.index];
            }
            $('[prnt="empbirthday"]').fadeIn(500);
        });
    }
}

ngApp_HighlightsOfWeek..annotations = [

    new angular.ComponentAnnotation({

        selector: 'employeeBirthday',
        appInjector: [birthdayApp.Services.GetBirthdaysService]

    }),
    new angular.ViewAnnotation({

        template: '<div class="row event_post" id="dvNewJoinee">' +
	                '<div class="col-xs-12 col-sm-5 col-md-5">' +
		                '<h4>HAPPY BIRTHDAY</h4>' +
		                '<img src="{{ current.Display_Picture_Url }}" prnt="empbirthday">' +
	                '</div>' +
	                '<div class="col-xs-12 col-sm-7 col-md-7" style="padding-top:45px;">' +
		                '<div style="width:100%; text-align:right;">' +

		                '<span class="ms-promlink-button-image" style="float:right;cursor:pointer;margin-top:15px;" >' +
		                '<img  (click)="onNextClick()" src="/_layouts/15/images/spcommon.png?rev=42" border="0" style="height:initial !important;width:initial !important;" class="ms-promlink-button-right"  alt="Next">' +
		                '</span>' +

		                '<h4 style="float:right;" >{{ index+1 }}/{{ newJoinees.length }}</h4>' +

		                '<span class="ms-promlink-button-image" style="float:right;cursor:pointer;margin-top:15px;" >' +
		                '<img  (click)="onPrvsClick()" src="/_layouts/15/images/spcommon.png?rev=42" border="0" style="height:initial !important;width:initial !important;" class="ms-promlink-button-left"  alt="Next">' +
		                '</span>' +

		                '</div>' +
		                '<h5 prnt="empbirthday">{{ current.Name }}</h5>' +
		                '<h6 prnt="empbirthday">{{ current.Date_Of_Birth }}</h6>' +
		                '<h6 prnt="empbirthday">{{ current.Location }}</h6>' +
                        '<div class="row" style="margin-top: 20%;">' +
			'<div class="col-xs-2 col-sm-2 col-md-2">' +

			'</div>' +
			'<div class="col-xs-10 col-sm-10 col-md-10">' +
				'<div class="input-group">' +
					'<a href="mailto:{{ current.Email }}?&subject=HAPPY BIRTHDAY&body=Wish you avery happy birthday!" target="_top">Wish in mail</a>' +
				'</div>' +

			'</div>' +
		'</div>' +

	                '</div>' +
                '</div>',

        directives: [angular.NgFor]
    })
];

birthdayApp.EmployeeBirthday.parameters = [[birthdayApp.Services.GetBirthdaysService]];

$(document).ready(function () {

    angular.bootstrap(birthdayApp.EmployeeBirthday);
});
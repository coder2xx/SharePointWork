// JavaScript source code
ngApp_HighlightsOfWeek.Services.GetOnBoardingsService = function () {

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

ngApp_HighlightsOfWeek.Services.GetAppreciationsService = function () {

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

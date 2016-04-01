
var Apps = window.Apps || {};

Apps.Videos = Apps.Videos || {};

Apps.Videos.Services = Apps.Videos.Services || {};

Apps.Videos.Services.GetService = function () {

    var thisService = this;

    thisService.IsVideoPortalEnabled = true;

    thisService.VideoPortalUrl = "";


    // #region: PUBLIC FUNCTIONS

    thisService.GetPopularVideos = function (StartIndex, VideoItemsLimit) {

        var startIndex = StartIndex || 0;
        var itemLimit = VideoItemsLimit || 5;

        var popularVideos = [];

        var defObj = new $.Deferred();
        {
            GetVideoPortalUrl().then(function (isVideoPortalEnabled, videoPortalUrl) {

                thisService.IsVideoPortalEnabled = isVideoPortalEnabled;
                thisService.VideoPortalUrl = videoPortalUrl;

                if (thisService.IsVideoPortalEnabled == true) {

                    getPopularVideos(videoPortalUrl, startIndex, itemLimit).then(function (videos) {

                        defObj.resolve(videos);
                    });
                }
                else {

                    defObj.resolve(popularVideos);
                }
            });
        }
        return defObj.promise();
    }

    thisService.GetChannels = function (PageSize, SkipPages) {

        var pageSize = PageSize || 10;
        var skipPages = SkipPages || 0;

        var channels = [];

        var defObj = new $.Deferred();
        {
            GetVideoPortalUrl().then(function (isVideoPortalEnabled, videoPortalUrl) {

                thisService.IsVideoPortalEnabled = isVideoPortalEnabled;
                thisService.VideoPortalUrl = videoPortalUrl;

                if (thisService.IsVideoPortalEnabled == true) {

                    getChannels(videoPortalUrl, pageSize, skipPages).then(function (channels) {

                        defObj.resolve(channels);
                    });
                }
                else {

                    defObj.resolve(channels);
                }
            });
        }
        return defObj.promise();
    }

    thisService.GetVideos = function () {

        var defObj = new $.Deferred();
        {
            GetVideoPortalUrl().then(function (isVideoPortalEnabled, videoPortalUrl) {

                thisService.IsVideoPortalEnabled = isVideoPortalEnabled;
                thisService.VideoPortalUrl = videoPortalUrl;

                if (thisService.IsVideoPortalEnabled == true) {

                    getChannels(thisService.VideoPortalUrl).then(function (channels) {

                        thisService.Channels = channels;

                        if (thisService.Channels.length > 0) {

                            getVideosByChannels(thisService.VideoPortalUrl, thisService.Channels).then(function (videos) {

                                defObj.resolve(videos);
                            });
                        }
                        else {

                            var videos = [];
                            defObj.resolve(videos);
                        }
                    });
                }
                else {

                    var videos = [];
                    defObj.resolve(videos);
                }
            });
        }
        return defObj.promise();
    }

    // #endregion: PUBLIC FUNCTIONS


    // #region: PRIVATE FUNCTIONS

    /// GET PORTAL URL
    getVideoPortalUrl = function () {

        success_GetVideoPortalUrl = function (data) {

            defObj.resolve(data.d.IsVideoPortalEnabled, data.d.VideoPortalUrl);
        }
        error_GetVideoPortalUrl = function (data) {

            console.log("error_GetVideoPortalUrl : ");

            defObj.reject("");
        }

        var defObj = new $.Deferred();
        {
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/VideoService.Discover",
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: success_GetVideoPortalUrl,
                error: error_GetVideoPortalUrl
            });
        }
        return defObj.promise();
    }

    /// GET POPULAR VIDEOS 
    getPopularVideos = function (videoPortalUrl, StartIndex, ItemLimit) {

        success_getPopularVideos = function (data) {
            //debugger
            var videos = [];
            try {
                videos = data.d.results;
            }
            catch (exception) {

                console.log(exception.number + " : " + exception.message);

                videos = [];
            }
            defObj.resolve(videos);
        }
        error_getPopularVideos = function (data) {

            console.log("error_getPopularVideos : ");

            var videos = [];
            defObj.reject(videos);
        }

        var defObj = new $.Deferred();
        {
            var startIndex = StartIndex || 0;
            var itemLimit = ItemLimit || 5;

            $.ajax({
                url: videoPortalUrl + "/_api/videoservice/search/popular(startItemIndex='" + startIndex + "',itemLimit='" + itemLimit + "')",
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: success_getPopularVideos,
                error: error_getPopularVideos
            });
        }
        return defObj.promise();
    }

    /// GET CHANNELS
    getChannels = function (videoPortalUrl, PageSize, SkipPages) {

        success_GetChannels = function (data) {
            //debugger
            var channels = [];
            try {
                channels = data.d.results;
            }
            catch (exception) {

                console.log(exception.number + " : " + exception.message);

                channels = [];
            }
            defObj.resolve(channels);
        }

        error_GetChannels = function (data) {

            console.log("error_GetChannels : ");

            var channels = [];
            defObj.reject(channels);
        }

        var defObj = new $.Deferred();
        {
            var pageSize = PageSize || 10;
            var skipPages = SkipPages || 0;
            var skipSize = skipPages * pageSize;

            var getChannelsAPI = videoPortalUrl + "/_api/VideoService/Channels";
            getChannelsAPI += "?$top=" + pageSize + "&$skip=" + skipSize;
            getChannelsAPI += "&$select=id,title,tilehtmlcolor";
            getChannelsAPI += "&$orderby=title";

            $.ajax({
                url: getChannelsAPI,
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: success_GetChannels,
                error: error_GetChannels
            });
        }
        return defObj.promise();
    }

    /// GET CHANNEL DETAILS
    getChannelDetails = function (videoPortalUrl, ChannelGuID) {

        success_GetChannelDetails = function (data) {

            var channelDetails = {};

            try {

                channelDetails = data.d.results;
            }
            catch (exception) {

                console.log("Exception @ success_GetChannelDetails : ");
                console.log(exception.number + " : " + exception.message);
            }
            defObj.resolve(channelDetails);
        }

        error_GetChannelDetails = function (data) {

            console.log("error_GetChannelDetails : ");

            var emptyDetails = {};

            defObj.reject(emptyDetails);
        }

        var defObj = new $.Deferred();
        {
            if (!ChannelGuID) {

                var emptyDetails = {};
                defObj.resolve(emptyDetails);
            }
            else {

                var getChannelDetailsAPI = videoPortalUrl + "/_api/videoservice/Channels(guid'" + ChannelGuID + "')?";
                getChannelDetailsAPI += "&$select=CanAdministrateByCurrent,CanEditByCurrent,CanViewByCurrent";

                $.ajax({
                    url: getChannelDetailsAPI,
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: success_GetChannelDetails,
                    error: error_GetChannelDetails
                });
            }
        }
        return defObj.promise();
    }

    /// GET VIDEOS BY CHANNELS
    getVideosByChannels = function (videoPortalUrl, channels) {

        var defObj = new $.Deferred();
        {
            var promises = [];

            for (chnlCntr = 0; chnlCntr < channels.length; chnlCntr++) {

                promises.push(GetVideosByChannel(videoPortalUrl, channels[chnlCntr].Id));
            }

            var videos = [];

            $.when.apply($, promises).then(function () {

                for (argCntr = 0; argCntr < arguments.length; argCntr++) {

                    videos.concat(arguments[argCntr]);
                }
                defObj.resolve(videos);
            });
        }
        return defObj.promise();
    }

    /// GET VIDEOS BY CHANNEL
    getVideosByChannel = function (videoPortalUrl, ChannelGuID, PageSize, SkipPages) {

        success_GetVideosByChannel = function (data) {

            var videos = [];

            try {

                videos = data.d.results;
            }
            catch (exception) {

                console.log(exception.number + " : " + exception.message);

                videos = [];
            }
            defObj.resolve(videos);
        }

        error_GetVideosByChannel = function (data) {

            console.log("error_GetVideosByChannel : ");

            var videos = [];

            defObj.reject(videos);
        }

        var defObj = new $.Deferred();
        {
            var pageSize = PageSize || 10;
            var skipPages = SkipPages || 0;
            var skipVideos = pageSize * skipPages;

            var getVideosByChannelAPI = videoPortalUrl + "/_api/VideoService/Channels(guid'" + ChannelGuID + "')/Videos?";
            getVideosByChannelAPI += "&$top=" + pageSize + "&$skip=" + skipVideos;
            getVideosByChannelAPI += "&$select=Title,DefaultEmbedCode,ChannelID";

            $.ajax({
                url: getVideosByChannelAPI,
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: success_GetVideosByChannel,
                error: error_GetVideosByChannel
            });
        }
        return defObj.promise();
    }

    /// GET VIDEOS BY CHANNEL
    searchVideosByChannel = function (videoPortalUrl, ChannelGuID, PageSize, SkipPages, SearchText) {

        success_searchVideosByChannel = function (data) {

            var videos = [];

            try {

                videos = data.d.results;
            }
            catch (exception) {

                console.log(exception.number + " : " + exception.message);

                videos = [];
            }
            defObj.resolve(videos);
        }

        error_searchVideosByChannel = function (data) {

            console.log("error_GetVideosByChannel : ");

            var videos = [];

            defObj.reject(videos);
        }

        var defObj = new $.Deferred();
        {
            var searchText = SearchText || "*";

            var pageSize = PageSize || 10;
            var skipPages = SkipPages || 0;
            var skipVideos = pageSize * skipPages;

            var searchVideosByChannelAPI = videoPortalUrl + "/_api/VideoService/Channels(guid'" + ChannelGuID + "')/Search/Query";
            searchVideosByChannelAPI += "?querytext='" + searchText + "'";
            searchVideosByChannelAPI += "&$top=" + pageSize + "&$skip=" + skipVideos;
            searchVideosByChannelAPI += "&$select=Title,DefaultEmbedCode,ChannelID";

            $.ajax({
                url: searchVideosByChannelAPI,
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: success_searchVideosByChannel,
                error: error_searchVideosByChannel
            });
        }
        return defObj.promise();
    }

    // #endregion: PRIVATE FUNCTIONS
}

videosApp.VideoComponent = function (GetVideosService) {
    var thisVideoComponent = this;
    thisVideoComponent.index = 0;
    thisVideoComponent.current = {
        ID: "",
        Name: "loading...",
        Email: "",
        Date_Of_Joining: "loading...",
        Location: "loading...",
        Display_Picture_Url: ""
    }
    thisVideoComponent.videos = [];
    thisVideoComponent.videos.push({ 'Title': 'loading..', 'Channel': '', 'CreatedDate': '' });
    GetVideosService.GetPopularVideos(0, 10).then(function (NewJoineesList) {
        //debugger
        thisVideoComponent.videos = NewJoineesList;
        if (thisVideoComponent.videos.length > 0) {
            thisVideoComponent.index = 0;
            thisVideoComponent.current = thisVideoComponent.videos[0];
        }
        else {
            thisVideoComponent.index = 0;
            thisVideoComponent.current = "";
        }
    });
}

videosApp.VideoComponent.annotations = [
    new angular.ComponentAnnotation({
        selector: 'component-o365video',
        appInjector: [videosApp.Services.GetVideosService]
    }),
    new angular.ViewAnnotation({
        template: '<div  id="videoCarousel" class="carousel slide" data-ride="carousel">' +

				    '<div class="carousel-inner" role="listbox">' +
        '<div  class="item" *ng-for="#vid of videos; #vidI = index" [class.active]="vidI == 0" >' +
        '<a href="{{ vid.Url}}">' +
        '<div id="vidTitle" title="{{ vid.Title}}" >' +
        '{{ vid.Title }}</div>' +
        '<img  src="{{ vid.ThumbnailUrl }}" alt="{{ vid.Title}}">' +
        '</a>' +
        '</div>' +
				    '</div>' +
        '<a class="left carousel-control" href="#videoCarousel" role="button" data-slide="prev">' +
        '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
        '<span class="sr-only">Previous</span>' +
        '</a>' +
        '<a class="right carousel-control" href="#videoCarousel" role="button" data-slide="next">' +
        '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>' +
        '<span class="sr-only">Next</span>' +
        '</a>' +

        '</div>',
        directives: [angular.NgFor, ]
    })
];
videosApp.VideoComponent.parameters = [[videosApp.Services.GetVideosService]];
$(document).ready(function () {

    angular.bootstrap(videosApp.VideoComponent);
});


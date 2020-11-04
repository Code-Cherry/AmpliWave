/*
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="youtube.js"></script>
<script src="https://apis.google.com/js/api.js"></script>
*/



//apostrophe = &#39; //total count: 4
var search;
var option;
function inputArtist(name, select) {
	search = name;
	option = select;
	return search;
}

/*function inputSong(name, artist) {
	search = name+" "+artist;
	return search;
}*/

$(document).ready(function() {

    var API_KEY = 'AIzaSyDCM6YJAK5LkbSgnZG3jGQz5rE9BBXtS44'; //change 
    var URL = 'https://www.googleapis.com/youtube/v3/search';
     //input song, artist, or album (change so that it takes input)
    var videosList;
    var releaseList;
	var videoId;


    //var artist = '';
    //var album = '';

    var options = {
        part: 'snippet',
        key: API_KEY,
        maxResults: 10, //gives list of first 10 relevant videos
        order: "viewCount",
        q: search //what user is searching for
    }
	
	var options2 = {
        part: 'snippet',
        key: API_KEY,
        maxResults: 10, //gives list of first 10 relevant videos
        order: "relevance",
        q: search //what user is searching for
    }
	
	if (option == 2) {
		getInfo(); 
	}
	else {
		getInfo2();
	}
   
   function getInfo2() {
        $.getJSON(URL, options2, function(data) {
			console.log(data);
			displayVideoHTML(data);
		})
    }
    function getInfo() {
        $.getJSON(URL, options, function(data) {
            console.log(data);

            /*var info = data.items[0].snippet.title; //var artist (original)
            console.log("Artist: " + getArtist(info));
            document.writeln("Artist: " + getArtist(info));

            console.log("Song: " + getSong(info));
            document.write("<br>Song: " + getSong(info) + "</br>");*/
            
            videosList = displayTen(data);

            /*for(var i = 0; i < videosList.length; i++) {
                document.write("<br>" + videosList[i] + "</br>");
            }*/

            releaseList = getRelease(data);
			
			var output1 = document.getElementById("10");
			for (var i = 0; i < 10; i++) {
				output1.innerHTML += videosList[i]+"<br>Released on "+releaseList[i]+"<br><br>";
			}
			
			//var output2 = document.getElementById("video");
			//output2.innerHTML = "<iframe width=\"420\" height=\"315\" src=\"https://www.youtube.com/embed/"+videoId+"\"></iframe>";

            /*for(var i = 0; i < releaseList.length; i++) {
                document.write("<br>" + releaseList[i] + "</br>");
            }*/

            /*for(var i = 0; i < releaseList.length; i++) {
                document.write("<br> Video: " + videosList[i] + " Release Date:" + releaseList[i] + "</br>");
            }*/

        })
    }

    function getRelease(data) {
        var release = [];

        $.each(data.items, function(i, item) {
            var info = item.snippet.publishedAt;
			for (var i = 0; i < 10; i++) {
				if (i == 0) {
					var date = info[0];
				}
				else {
					date += info[i];
				}
			}
            release.push(date);
            //console.log(info);
    })
        return release;
    }


    function displayTen(data) {
        var videos = [];
        $.each(data.items, function(i, item) {
            var info = item.snippet.title;
            videos.push(info);
            //console.log(info);
		})
        return videos;
	}
	
	function displayVideo(data) {
        var id;
		var i = 0;
        $.each(data.items, function(i, item) {
			if (i == 0) {
				id = item.id.videoId;
			}
			i++;
		})
        return id;
	}
	
	function displayVideoHTML(data) {
        var videoId = displayVideo(data);
		var output2 = document.getElementById("video");
		output2.innerHTML = "<iframe width=\"420\" height=\"315\" src=\"https://www.youtube.com/embed/"+videoId+"\"></iframe>";
	}

    function getAlbum(data) {
        ;
    }

    function getSong(data) {
        var apostrophe = data.indexOf('&');
        var firstHalf = data.substr(0, apostrophe);
        var secondHalf = data.substr(apostrophe + 5);
        var song = firstHalf + "\'" + secondHalf;
        return song;
    }

    function getArtist(data) {
        var dash = data.indexOf("-") - 1; //usually the artist name is first then followed by dash
        var artist = data.substr(0, dash);
        return artist;
    }

});

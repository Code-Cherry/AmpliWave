/*
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="youtube.js"></script>
<script src="https://apis.google.com/js/api.js"></script>
*/



//apostrophe = &#39; //total count: 4
var search;
var option;

//var artname = track_artist;
function inputArtist(name, select) {
	search = name;
	option = select;
	return search;
}


$(document).ready(function() {
    //var API_KEY = 'AIzaSyDSK10k5b9jRmWtMXb8tiLCBfDpeRRbrl4'; //original team email api
    var API_KEY = 'AIzaSyDCM6YJAK5LkbSgnZG3jGQz5rE9BBXtS44'; //change 
    var URL = 'https://www.googleapis.com/youtube/v3/search';
    var URL2 = 'https://www.googleapis.com/youtube/v3/playlistItems'; //used when using playlistitems

     //input song, artist, or album (change so that it takes input)
    var videosList;
    var releaseList;
    var videoId; //single video id
    var idsList;  //list of video ids
    var playlistIdentity; //playlist id of playlist
	var albumVideos; //list of videos from album
	var albumVideo; //sometimes there isn't a playlist and usually a whole video of album


    //var artist = '';
    //var album = '';

    //used to search 
    var options = {
        part: 'snippet',
        key: API_KEY,
        maxResults: 25, //gives list of first 10 most viewed videos
        order: "viewCount",
        q: search //what user is searching for
    }
	
	var options2 = {
        part: 'snippet',
        key: API_KEY,
        maxResults: 25, //gives list of first 10 relevant videos
        order: "relevance",
        q: search //what user is searching for
    }
	
	//used for album videos
	var options3 = {
		part: 'snippet',
        key: API_KEY,
        maxResults: 5, //gives list of album songs
        order: "relevance",
		//type: "playlist"
        q: search + "full album"  //what user is searching for
	}
	
	if (option == 3) {
		getInfo3();	
		//console.log(playlistIdentity);
	}
	
	else if (option == 2) {
		getInfo();
	}
	else {
		getInfo2();
	}

    function getInfo3() {
        $.getJSON(URL, options3, function(data) {
            console.log(data);
                
            if(data.items[0].id.kind != "youtube#playlist") {
                albumVideo = data.items[0].snippet.title;
                videoId = data.items[0].id.videoId;
  
                var output1 = document.getElementById("20"); //change to where the links will be placed
                output1.innerHTML += "<a href=\"https://www.youtube.com/watch?v=" + videoId + "\">" + albumVideo+"<br>";
                
            }
    
            else {
                playlistIdentity = data.items[0].id.playlistId;
                console.log(playlistIdentity);
                
                var options4 = {
                    part: 'snippet',
                    key: API_KEY,
                    maxResults: 50,
                    playlistId: playlistIdentity
                }
                
                $.getJSON(URL2, options4, function(data2) {
                    console.log(data2);
                    albumVideos = getAlbumVideos(data2);
                    idsList = getAlbumVidIds(data2);
                    console.log(albumVideos);
                    console.log(idsList);
                    
                    var output1 = document.getElementById("20"); //change the 20
                    for (var i = 0; i < albumVideos.length; i++) {
                        output1.innerHTML += "<a href=\"https://www.youtube.com/watch?v=" + idsList[i] + "\">" + albumVideos[i]+"<br>";
                }
                })
            }
        })
    }
    
   
   function getInfo2() {
        $.getJSON(URL, options2, function(data) {
            console.log(data);
            displayVideoHTML(data);
		})
    }
    function getInfo() {
        $.getJSON(URL, options, function(data) {
            //console.log(data);
            console.log(search);
            //document.write(search);
            //document.write(search2);
            /*var info = data.items[0].snippet.title; //var artist (original)
            console.log("Artist: " + getArtist(info));
            document.writeln("Artist: " + getArtist(info));

            console.log("Song: " + getSong(info));
            document.write("<br>Song: " + getSong(info) + "</br>");*/
            
            videosList = displayTen(data);
            idsList = getArtVideoIds(data);
            console.log(idsList);
            
            //console.log(artname);

            /*for(var i = 0; i < videosList.length; i++) {
                document.write("<br>" + videosList[i] + "</br>");
            }*/

            releaseList = getRelease(data);
			
			var output1 = document.getElementById("10");
			for (var i = 0; i < 10; i++) {
                output1.innerHTML += "<a href=\"https://www.youtube.com/watch?v=" + idsList[i] + "\">" + videosList[i] + "<br>Released on " + releaseList[i] + "<br><br>";
                //output1.innerHTML += videosList[i] + "<br>Released on " + releaseList[i] + "<br><br>";
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

    //add a way so that it compares the artist's name with the first size() of name to see if it by them
    //compare each character and check if equal either upper to lower cased
    function displayTen(data) {
        var videos = [];
        var artist_name = '';
        artist_name = search + ' -';
        artist_nosspace = search;
        artist_frontspace = ' ' + search;
        //console.log(artist_name);
        var size = search.length;
        //console.log(size);
        var equal;
        var page = data.nextPageToken;
        //console.log(page);
       
        $.each(data.items, function(i, item) {
            var info = item.snippet.title;
            //var parse = info.substr(0, size + 1);
            //console.log(parse);
            //equal = artist_name.toUpperCase() === parse.toUpperCase();
            //console.log(equal);

            var art_info = '';
            art_info = info;
            var art_infocap = art_info.toUpperCase();
            var artist_namecap = artist_name.toUpperCase();
            var artist_nosspacecap = artist_nosspace.toUpperCase();
            var artist_frontspacecap = artist_frontspace.toUpperCase();
            //console.log(artist_frontspacecap);
            //console.log(artist_namecap);

            
            if (art_infocap.includes(artist_namecap) == true) {
                videos.push(info);
            }
            else if(art_infocap.includes(artist_nosspacecap) == true) {
                videos.push(info);
            }

            else if(art_infocap.includes(artist_frontspacecap) == true) {
                videos.push(info);
            }
            /*if (equal == true) {
                videos.push(info);
            }*/
        })
            
        /*var options_2= {
            part: 'snippet',
            key: API_KEY,
            maxResults: 10, //gives list of first 10 relevant videos
            pageToken: page,
            order: "viewCount",
            q: search //what user is searching for
        }

        $.getJSON(URL, options_2, function(data) {
			console.log(data);
		})

            $.each(data.items, function(i, item) {
                var info = item.snippet.title;
                var parse = info.substr(0, size + 1);
                console.log(parse);
                equal = artist_name.toUpperCase() === parse.toUpperCase();
                console.log(equal);
    
    
                if (equal == true) {
                    videos.push(info);
                }
            })*/
        

        return videos;
    }
    

    function getArtVideoIds(data) {
        var ids = [];
        //console.log(data);
        var artist_name = '';
        artist_name = search + ' ';
        //console.log(artist_name);
        var size = search.length;
        //console.log(size);
        var equal;
        var page = data.nextPageToken;
        //console.log(page);
       
        $.each(data.items, function(i, item) {
            var info = item.snippet.title;
            var idinfo = item.id.videoId;

            var parse = info.substr(0, size + 1);
            //console.log(parse);
            equal = artist_name.toUpperCase() === parse.toUpperCase();
            //console.log(equal);


            if (equal == true) {
                ids.push(idinfo);
            }
        })
            
        /*var options_2= {
            part: 'snippet',
            key: API_KEY,
            maxResults: 50, //gives list of first 10 relevant videos
            pageToken: page,
            order: "viewCount",
            q: search //what user is searching for
        }

        $.getJSON(URL, options_2, function(data) {
			console.log(data); 
		})

            $.each(data.items, function(i, item) {
                var info = item.snippet.title;
                var idinfo = item.id.videoId;

                var parse = info.substr(0, size + 1);
                console.log(parse);
                equal = artist_name.toUpperCase() === parse.toUpperCase();
                console.log(equal);
    
    
                if (equal == true) {
                    ids.push(idinfo);
                }
            })*/
        

        /*$.each(data.items, function(i, item) {
            var info = item.id.videoId;
            ids.push(info);
            //console.log(info);
		})*/
        return ids;
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
    
    function getAlbumVideos(data) {
        var videos = [];
            
        $.each(data.items, function(i, item) {
            var info = item.snippet.title;
            videos.push(info);
            //console.log(info);
        })
            
        return videos;
    }

    function getAlbumVidIds(data) {
        var ids = [];

        $.each(data.items, function(i, item) {
            var info = item.snippet.resourceId.videoId;
            ids.push(info);
        })
        return ids;
    }
    
	
	function displayVideoHTML(data) {
        var videoId = displayVideo(data);
		var output2 = document.getElementById("video");
		output2.innerHTML = "<iframe width=\"420\" height=\"315\" src=\"https://www.youtube.com/embed/"+videoId+"\"></iframe>";
	}

    /*function getAlbum(data) {
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
    }*/

});

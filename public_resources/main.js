$(function(){
    // Ready

    $(".line-player .main-frame .configurator").each(function(){
        let player = $(this).parent().parent();
        let playerConfiguration = {
            title : $(this).data("title"),
            subtitle : $(this).data("subtitle"),
            imgIcon : $(this).data("imgicon"),
            streamType : $(this).data("streamtype"),
            streamFormat : $(this).data("streamformat"),
            streamURL : $(this).data("streamurl"),
            volume : $(this).data("volume"),
            autoPlay : $(this).data("autoplay"),
            backgroundColor : hexToRgb($(this).data("backgroundcolor")),
            fontColor : hexToRgb($(this).data("fontcolor"))
        };


        // Set styles
        player.find(".main-frame .main-container .infobox h2").text(playerConfiguration.title);
        player.find(".main-frame .main-container .infobox h4").text(playerConfiguration.subtitle);
        player.find(".img-album").css("background-image", 'url("'+playerConfiguration.imgIcon+'")');
        player.find(".main-frame").css("border-color", "rgba("+playerConfiguration.backgroundColor.r+", "+playerConfiguration.backgroundColor.g+", "+playerConfiguration.backgroundColor.b+", 0.5)");
        player.find(".main-frame").css("background-color", "rgba("+playerConfiguration.backgroundColor.r+", "+playerConfiguration.backgroundColor.g+", "+playerConfiguration.backgroundColor.b+", 0.5)");
        player.find(".main-frame .volume-color-print").css("background-color", "rgba("+playerConfiguration.backgroundColor.r+", "+playerConfiguration.backgroundColor.g+", "+playerConfiguration.backgroundColor.b+", 0.2)");


        // Set player functions
        let validPlayer = true;
        switch(playerConfiguration.streamType){
            case "audio":
                switch(playerConfiguration.streamFormat){
                    case "shoutcast":
                    case "icecast":
                    case "shoutcast2":
                    case "MP3":
                        player.find(".player").html("<audio class='playerObject'><source src='"+playerConfiguration.streamURL+"' type='audio/mpeg'/></audio>");
                        player.find(".playerObject").attr("src", playerConfiguration.streamURL);
                        player.find(".playerObject")[0].load();
                        break;
                    case "M3U8":
                    case "HLS":
                    case "DASH":
                        player.find(".player").html("<video class='playerObject'></video>");
                        let playerJSObj = player.find(".player .playerObject")[0];
                        if(Hls.isSupported()){
                            let hls = new Hls();
                            hls.loadSource(playerConfiguration.streamURL);
                            hls.attachMedia(playerJSObj);
                        }else if(playerJSObj.canPlayType('application/vnd.apple.mpegurl')){
                            playerJSObj.src = playerConfiguration.streamURL;
                        }
                        break;
                    default:
                        validPlayer = false;
                        console.error("Line Player Error: Invalid player 'streamFormat', valid options: [shoutcast | shoutcast2 | icecast | MP3 | M3U8 | HLS | DASH]");
                }
                break;
            case "video":
                break;
            default:
                validPlayer = false;
                console.error("Line Player Error: Invalid player 'streamType', valid options: [audio | video]");
        }


        if(validPlayer){
            changeVolume(player, playerConfiguration.volume);
            if(playerConfiguration.autoPlay){
                togglePlayPause(player.find(".main-button .icon"), true);
            }
        }
    });






    $(document).on('click', '.icon', function(e){
        togglePlayPause($(this));
    });

    function togglePlayPause(iconPlayPauseObj, withoutUserInteraction = false){
        let isPlaying = false;
        let playerObj = iconPlayPauseObj.parent().parent().find(".playerObject");
        if(iconPlayPauseObj.hasClass("icon-pause")){
            isPlaying = true;
        }


        if(withoutUserInteraction){
            let JSHTML5Player = playerObj.get(0);
            JSHTML5Player.play();
            if(JSHTML5Player.paused){
                playerObj.trigger('play');
            }
            if(!JSHTML5Player.paused){
                // Without user interact trigger worked, change icon status.
                iconPlayPauseObj.removeClass("icon-play").addClass("icon-pause");
            }

            return;
        }

        if(isPlaying){
            iconPlayPauseObj.removeClass("icon-pause").addClass("icon-play");
            playerObj.trigger('pause');
        }else{
            iconPlayPauseObj.removeClass("icon-play").addClass("icon-pause");
            playerObj.trigger('play');
        }
    }




    /*

        VOLUME SETTINGS

     */
    $('.volume-overlay').on('mousedown', function() {
        $('.volume-overlay').on('mousemove', function(e) {
            $('html,body').stop(false, true);
            let grabber = $(this);
            let longX = grabber.width();
            let xCursor = e.pageX - grabber.offset().left;
            let percentX = (xCursor*100)/longX;
            changeVolume($(this), percentX);
        });

        $('.volume-overlay').on('mouseleave', function(e){
            $('.volume-overlay').off('mousemove');
        });
    });

    $('.volume-overlay').on('mouseup', function() {
        $('.volume-overlay').off('mousemove');
    });


    function changeVolume(playerJQObj, volumePercent){
        if(volumePercent >= 100){
            volumePercent = 100;
        }
        if(volumePercent <= 0){
            volumePercent = 0;
        }

        playerJQObj.find(".volume-color-print").width(volumePercent+"%");
        playerJQObj.parent().find(".volume h5").text(Math.trunc(volumePercent)+"%");
        playerJQObj.parent().find(".volume i").removeClass('fa-volume-off').removeClass('fa-volume-down').removeClass('fa-volume-up');

        if((volumePercent/100) <= 0){
            playerJQObj.parent().find(".playerObject").prop("volume", 0);
        }else{
            playerJQObj.parent().find(".playerObject").prop("volume", volumePercent/100);
        }

        if(volumePercent > 60){
            playerJQObj.parent().find(".volume i").addClass('fa-volume-up');
        }else if(volumePercent > 0){
            playerJQObj.parent().find(".volume i").addClass('fa-volume-down');
        }else{
            playerJQObj.parent().find(".volume i").addClass('fa-volume-off');
        }
    }



    /*

        OTHER INTERNAL FUNCTIONS

     */
    function hexToRgb(hex) {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

});
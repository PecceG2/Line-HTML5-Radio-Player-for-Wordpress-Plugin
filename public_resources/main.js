$(function(){
    $(document).on('click', '.icon', function(e){
        let isPlaying = false;
        if($(this).hasClass("icon-pause")){
            isPlaying = true;
        }

        if(isPlaying){
            $(this).removeClass("icon-pause").addClass("icon-play");

        }else{
            $(this).removeClass("icon-play").addClass("icon-pause");
        }




        let video = document.getElementsByClassName('player')[0];
        var videoSrc = 'https://mega.stweb.tv/mega983/live/chunks.m3u8';
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
        }
            // HLS.js is not supported on platforms that do not have Media Source
            // Extensions (MSE) enabled.
            //
            // When the browser has built-in HLS support (check using `canPlayType`),
            // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
            // element through the `src` property. This is using the built-in support
            // of the plain video element, without using HLS.js.
            //
            // Note: it would be more normal to wait on the 'canplay' event below however
            // on Safari (where you are most likely to find built-in HLS support) the
            // video.src URL must be on the user-driven white-list before a 'canplay'
            // event will be emitted; the last video event that can be reliably
        // listened-for when the URL is not on the white-list is 'loadedmetadata'.
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
        }


    });


    $('.volume-overlay').on('mousedown', function() {
        $('.volume-overlay').on('mousemove', function(e) {
            $('html,body').stop(false, true);
            let grabber = $(this);
            let longX = grabber.width();
            let xCursor = e.pageX - grabber.offset().left;
            let percentX = (xCursor*100)/longX;

            if(percentX >= 100){
                percentX = 100;
            }

            $(".volume-color-print").width(percentX+"%");
            $(".volume h5").text(Math.trunc(percentX)+"%");
            $(".volume i").removeClass('fa-volume-off').removeClass('fa-volume-down').removeClass('fa-volume-up');

            if((percentX/100) <= 0){
                $(".player").prop("volume", 0);
            }else{
                $(".player").prop("volume", percentX/100);
            }


            if(percentX > 60){
                $(".volume i").addClass('fa-volume-up');
            }else if(percentX > 0){
                $(".volume i").addClass('fa-volume-down');
            }else{
                $(".volume i").addClass('fa-volume-off');
            }


            //console.log('x: '+Math.trunc(percentX)+" | y: "+percentY);
        });

        $('.volume-overlay').on('mouseleave', function(e){
            $('.volume-overlay').off('mousemove');
        });
    });

    $('.volume-overlay').on('mouseup', function() {
        $('.volume-overlay').off('mousemove');
    });

});
<?php
/**
 * Plugin Name: Line Radio Player
 * Plugin URI: https://github.com/PecceG2/Line-HTML5-Radio-Player-for-Wordpress-Plugin
 * Description: Line Radio Player is a WordPress plugin for HTML5 audio streaming and video player.
 * Version: 1.0
 * Author: Giuliano Peccetto
 * Author URI: https://www.pecceg2.com/
 */


/*########################################################################*/
//		  						SHORTCODES								  //
/*########################################################################*/

function sc_player_print($atts){

	//         <div class="configurator" data-title="RADIO MEGA 99.9" data-subtitle="PROGRAMA 01 - RADIO MEGA" data-imgicon="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/koanalbum.png" data-streamtype="audio" data-streamformat="shoutcast2" data-streamurl="https://srv591.grupomultimedios.com.ar:9902/radio/8040/radio.mp3?1621958643" data-volume="80" data-autoplay="false" data-backgroundcolor="#FA225B" data-fontcolor="#FFF"></div>
    $default = array(
        'title' => 'Welcome to Line Player',
		'subtitle' => 'Change this message with title and subtitle tags',
		'imgicon' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Microsoft_Stream.svg/1200px-Microsoft_Stream.svg.png',
		'streamtype' => 'audio',
		'streamformat' => 'shoutcast2',
		'streamurl' => 'https://srv591.grupomultimedios.com.ar:9902/radio/8040/radio.mp3',
		'volume' => '80',
		'autoplay' => 'false',
		'backgroundcolor' => '#0088ff',
		'fontcolor' => '#FFF'
    );
	
    $attr = shortcode_atts($default, $atts);

	$playerHTML = file_get_contents(plugins_url('/public_resources/audio_player.html', __FILE__));

	// Static files
	$public_resources_folder = plugins_url('/public_resources/', __FILE__);

	// Attrs
	$playerHTML = str_replace("{{PLUGINDIR}}", $public_resources_folder, $playerHTML);
	$playerHTML = str_replace("{{TITLE}}", $attr['title'], $playerHTML);
	$playerHTML = str_replace("{{SUBTITLE}}", $attr['subtitle'], $playerHTML);
	$playerHTML = str_replace("{{IMGICON}}", $attr['imgicon'], $playerHTML);
	$playerHTML = str_replace("{{STREAMTYPE}}", $attr['streamtype'], $playerHTML);
	$playerHTML = str_replace("{{STREAMFORMAT}}", $attr['streamformat'], $playerHTML);
	$playerHTML = str_replace("{{STREAMURL}}", $attr['streamurl'], $playerHTML);
	$playerHTML = str_replace("{{VOLUME}}", $attr['volume'], $playerHTML);
	$playerHTML = str_replace("{{AUTOPLAY}}", $attr['autoplay'], $playerHTML);
	$playerHTML = str_replace("{{BACKGROUNDCOLOR}}", $attr['backgroundcolor'], $playerHTML);
	$playerHTML = str_replace("{{FONTCOLOR}}", $attr['fontcolor'], $playerHTML);


	return $playerHTML;
}
add_shortcode('line-player', 'sc_player_print');

// Fix Visual Composer addons/shortcodes runtime error.
function sc_player_print_forced($content){
	
	$data = getAllValues($content);
	if(!empty($data)){
		$i = 0;
		foreach($data['value'] as $key=>$value){
			$content = preg_replace('#\[line\-player valor\=\'\d+\'\]#', $data['value'][$i], $content, 1);
			$i++;
		}
	}

	return $content;
}

//Disabled temporally (Visual Composer update in next version)
//add_filter('the_content', 'sc_player_print_forced', 12);

/*########################################################################*/
//		  					   END SHORTCODES							  //
/*########################################################################*/


/*########################################################################*/
//		  					   OTHER FUNCTIONS							  //
/*########################################################################*/

function getAllValues($content){
    $offset = 0;
    $allpos = array();
    while(($pos = strpos($content, "[line-player", $offset)) !== FALSE){
		$tmpLast = strpos($content, "']", $pos);
        $allpos['startposition'][] = $pos;
		$allpos['endposition'][] = $tmpLast;
		//$allpos['value'][] = floatval(substr($content, $pos+22, $tmpLast-$pos-22))*floatval(get_option('dolar_value'));
		//$tmp_content = substr($content, $pos);
		
		
		//$content = str_replace("[wp-dolarizate valor='116']", ""
        $offset = $tmpLast; //Evite infinite loop
	}
	

    return $allpos;
}

/*########################################################################*/
//		  				 END OTHER FUNCTIONS							  //
/*########################################################################*/
?>
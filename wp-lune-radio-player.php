<?php
/**
 * Plugin Name: Lune Radio Player
 * Plugin URI: https://github.com/PecceG2/Lune-HTML5-Radio-Player-for-Wordpress-Plugin
 * Description: Lune Radio Player is a WordPress plugin for HTML5 audio streaming and video player.
 * Version: 0.5
 * Author: Giuliano Peccetto
 * Author URI: https://www.pecceg2.com/
 */


/*########################################################################*/
//		  						SHORTCODES								  //
/*########################################################################*/

function sc_player_print($atts){
    $default = array(
        'url' => '0',
		'color' => 'red',
		'typeStream' => '1',
		'volume' => '100',
		'autoplay' => '0'
    );
	
    $attr = shortcode_atts($default, $atts);

    // use $attr['url'], etc.
	return "html5 code here";
}
add_shortcode('lune-player', 'sc_player_print');

// Fix Visual Composer addons/shortcodes runtime error.
function sc_player_print_forced($content){
	
	$data = getAllValues($content);
	if(!empty($data)){
		$i = 0;
		foreach($data['value'] as $key=>$value){
			$content = preg_replace('#\[lune\-player valor\=\'\d+\'\]#', $data['value'][$i], $content, 1);
			$i++;
		}
	}

	return $content;
}

add_filter('the_content', 'sc_player_print_forced', 12);

/*########################################################################*/
//		  					   END SHORTCODES							  //
/*########################################################################*/


/*########################################################################*/
//		  					   OTHER FUNCTIONS							  //
/*########################################################################*/

function getCURL($url, $isJSON){
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
	if($isJSON){
		$content = json_decode(curl_exec($ch));
	}else{
		$content = curl_exec($ch);
	}
	curl_close($ch);
	return($content);
}

function getAllValues($content){
    $offset = 0;
    $allpos = array();
    while(($pos = strpos($content, "[gma-player", $offset)) !== FALSE){
		$tmpLast = strpos($content, "']", $pos);
        $allpos['startposition'][] = $pos;
		$allpos['endposition'][] = $tmpLast;
		$allpos['value'][] = floatval(substr($content, $pos+22, $tmpLast-$pos-22))*floatval(get_option('dolar_value'));
		$tmp_content = substr($content, $pos);
		
		
		//$content = str_replace("[wp-dolarizate valor='116']", ""
        $offset = $tmpLast; //Evite infinite loop
	}
	

    return $allpos;
}

/*########################################################################*/
//		  				 END OTHER FUNCTIONS							  //
/*########################################################################*/
?>
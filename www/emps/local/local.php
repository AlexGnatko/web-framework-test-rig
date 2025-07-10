<?php
// MAIN CONFIGURATION SCRIPT
// PLEASE REFER /modules/_common/config FOR MORE CONFIGURATION SCRIPTS

// hostname / URL configuration
if(!defined('EMPS_HOST_NAME')){
    define('EMPS_HOST_NAME','emps.test');
}

$emps_force_hostname = true;
$emps_localhost_mode = true;

define('EMPS_SCRIPT_WEB','http://'.EMPS_HOST_NAME);
define('EMPS_SCRIPT_URL_FOLDER','');

// file paths configuration
define('EMPS_SCRIPT_PATH','/srv/www/emps');
define('EMPS_INCLUDE_PATH',''); // always have the include paths separated by : (even on Windows)

if(!defined('EMPS_WEBSITE_SCRIPT_PATH')){
    define('EMPS_WEBSITE_SCRIPT_PATH',EMPS_SCRIPT_PATH);
}

// timezone correction configuration
define('EMPS_TZ_CORRECT',0);
define('EMPS_TZ','Asia/Irkutsk');

define('EMPS_DT_FORMAT','%d.%m.%Y %H:%M');

define('EMPS_UPLOAD_SUBFOLDER','/local/upload/');

define('EMPS_MIN_WATERMARKED', 600);

// script timing configuration
define('EMPS_TIMING',true);
define('EMPS_SHOW_TIMING',true);
define('EMPS_SHOW_SQL_ERRORS',true);

// session cookie parameters
define('EMPS_SESSION_COOKIE_LIFETIME',3600*24*7);

define('EMPS_DISPLAY_ERRORS',1);

define("EMPS_PRE_MINIFY", true);

define('CURRENT_LANG', 1);
define('PHOTOSET_WATERMARK', false);

define('EMPS_PHOTO_SIZE','1920x1920|100x100|inner');

define("EMPS_FONTS", "/srv/www/_fonts");

// database configuration. This object will be destroyed upon connection to the database for security reasons.
$emps_db_config = array(
    'host' => 'mysql-server',
    'database' => 'emps',
    'user' => 'root',
    'password' => 'aqweZqeazasd',
    'charset' => 'utf8');

define('TP', 'c_');	// table name prefix

// URL variable tracking configuration
// Variables watch list
define('EMPS_VARS', 'aact,pp,act,key,t,ss,start,start2,start3,start4,sk,dlist,sd,sm,cmd,sx,sy,sz');

// Variable/Path mapping string. Variables listed in the order that is used
// to retrieve them from URLs.
define('EMPS_URL_VARS', 'pp,key,start,ss,sd,sk,sm,sx,sy');

// language configuration
$emps_lang = 'ru';								// default language setting
$emps_lang_map = array('' => 'nn', 'en' => 'en');		// subdomain mapping for language settings

define("EMPS_VERSION", "6.5");
define("EMPS_FAST", "test");

<?php
/*
Plugin Name: MD5 Test Endpoint
Description: Outputs an MD5 hash of `number` if the URL path is `/test/`.
Version: 1.0
Author: ChatGPT 4o prompted by Alex Gnatko
*/

add_action('init', function () {
    $request_uri = $_SERVER['REQUEST_URI'];

    // Normalize and check if path is exactly /test/ or /test
    $path = parse_url($request_uri, PHP_URL_PATH);
    if ($path === '/test' || $path === '/test/') {
        header('Content-Type: text/plain');
        $number = $_GET['number'] ?? '';
        die(md5($number));
    }
});

<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/test/', function (Request $request, Response $response) {
    $queryParams = $request->getQueryParams();
    $number = $queryParams['number'] ?? '';
    $md5 = md5($number);
    die($md5);
});

$app->run();

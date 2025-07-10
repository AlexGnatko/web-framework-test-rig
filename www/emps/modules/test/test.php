<?php

$emps->plaintext_response();

$num = intval($_GET['number']);

echo md5($num);
//echo "=>".$emps->fast;

exit;
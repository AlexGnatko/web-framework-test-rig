<?php

$emps->plaintext_response();

$num = intval($_GET['number']);

echo md5($num);

exit;
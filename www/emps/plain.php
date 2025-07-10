<?php

$num = intval($_GET['number'] ?? "");

die(md5($num));

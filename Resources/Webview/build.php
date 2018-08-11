<?php

$svgContent = file_get_contents("evangelion-red-optimized.svg");
$htmlContent = file_get_contents("index-template.html");

$newHtmlContent = str_replace("<!--svg here-->", $svgContent, $htmlContent);

//write the entire string
file_put_contents('index.html', $newHtmlContent);
?>
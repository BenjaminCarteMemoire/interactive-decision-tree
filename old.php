<?php

function parseArgs($raw) {
    // Ex : title:"Texte", color:"red"
    $args = [];
    preg_match_all('/(\w+)\s*:\s*"([^"]*)"/', $raw, $m, PREG_SET_ORDER);
    foreach ($m as $match) {
        $args[$match[1]] = $match[2];
    }
    return $args;
}

function parseDSL($filePath) {
    $lines = file($filePath, FILE_IGNORE_NEW_LINES);
    $tree = [];
    $current = null;
    $type = null;
    $buffer = [];

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || $line[0] === '#') continue;

        // ---- Question ----
        if (preg_match('/^<"([^"]+)",(.*)>$/', $line, $m)) {
            $current = $m[1];
            $type = "question";
            $tree[$current] = [
                "type" => "question",
                "args" => parseArgs($m[2]),
                "text" => "",
                "answers" => []
            ];
            continue;
        }

        // ---- Leaf ----
        if (preg_match('/^\("([^"]+)",(.*)\)$/', $line, $m)) {
            $current = $m[1];
            $type = "leaf";
            $tree[$current] = [
                "type" => "leaf",
                "args" => parseArgs($m[2]),
                "text" => ""
            ];
            continue;
        }

        // ---- Action ----
        if (preg_match('/^\["([^"]+)",(.*)\]\s*=\s*"([^"]+)"$/', $line, $m)) {
            $tree[$m[1]] = [
                "type" => "action",
                "args" => parseArgs($m[2]),
                "to" => $m[3]
            ];
            $current = null;
            continue;
        }

        // ---- Answer (for question) ----
        if ($type === "question" && preg_match('/^\|(.+)\|\s*=\s*"([^"]+)"$/', $line, $m)) {
            $tree[$current]["answers"][] = [
                "args" => parseArgs($m[1]),
                "to" => $m[2]
            ];
            continue;
        }

        // ---- End of block ----
        if ($line === '-') {
            $current = null;
            $type = null;
            continue;
        }

        // ---- Any internal text ----
        if ($current !== null) {
            $tree[$current]["text"] .= $line . "\n";
        }
    }

    return $tree;
}
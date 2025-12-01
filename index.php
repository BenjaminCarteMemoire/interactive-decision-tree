<head>
    <title>Test IDT</title>
    <link rel="stylesheet" href="css/IDT.css" type="text/css">
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
</head>
<?php

include_once "vendor/autoload.php";

$a = new \InteractiveDecisionTree\IDT( "data/ctgp.idt" );
$a->parse();
// var_dump( $a->tree );
echo '<pre>';
echo $a->export_as_json();
echo '</pre>';
?>
<div id="idt_container"></div>
<script id="json_tree">
    const IDT_TREE = <?php echo $a->export_as_json(); ?>;
</script>
<script src="public/assets/main-DlKvcrLO.js"></script>

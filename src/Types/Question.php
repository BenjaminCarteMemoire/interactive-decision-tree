<?php

namespace InteractiveDecisionTree\Types;
use InteractiveDecisionTree\IDT;

class Question extends Abstract_Type {

    public function __construct(){
        parent::__construct( 'question', [
            'image_url' => ''
        ] );
    }

    public function find_pattern(
        array &$tree_instance,
        string|null &$current_line,
        string|null &$current_type,
        string|null &$current_key
    ): bool {

        if (preg_match('/^<"([^"]+)",(.*)>$/', $current_line, $m)) {

            $current_key = $m[1];
            $current_type = $this->type_name;
            $tree_instance[ $current_key ] = [
                'type' => $current_type,
                'args' => array_merge( $this->defaults, IDT::parse_args( $m[2] ) ),
                'text' => '',
                'answers' => []
            ];

            return true;

        }

        return false;

    }

}
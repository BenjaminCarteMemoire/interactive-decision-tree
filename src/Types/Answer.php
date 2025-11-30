<?php

namespace InteractiveDecisionTree\Types;
use InteractiveDecisionTree\IDT;

class Answer extends Abstract_Type {

    public function __construct(){
        parent::__construct( 'answer', [
            'color' => 'inherit',
            'icon' => '',
        ] );
    }

    public function find_pattern(
        array &$tree_instance,
        string|null &$current_line,
        string|null &$current_type,
        string|null &$current_key
    ): bool {

        if( $current_type != 'question' )
            return false;

        if (preg_match('/^\|(.+)\|\s*=\s*"([^"]+)"$/', $current_line, $m)) {

            // Previous key is the key of the question.
            $tree_instance[ $current_key ]["answers"][] = [
                "args" => array_merge( $this->defaults, IDT::parse_args( $m[1] ) ),
                "to" => $m[2]
            ];

            return true;

        }

        return false;

    }

}
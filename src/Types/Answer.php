<?php

namespace InteractiveDecisionTree\Types;
use InteractiveDecisionTree\IDT;
use InteractiveDecisionTree\Tables;

class Answer extends Abstract_Type {

    public function __construct(){
        parent::__construct( 'answer', [
            'color_preset' => 'none',
            'color' => 'green',
            'border-color' => 'border-green',
            'hover-color' => 'hover-green',
            'hover-border-color' => 'hover-border-green',
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

            $args = array_merge( $this->defaults, IDT::parse_args( $m[1] ) );

            if( $args['color_preset'] != 'none' ){

                $color_preset = Tables::color_preset( $args['color_preset'] );

                $args['color'] = $color_preset[0];
                $args['border-color'] = $color_preset[1];
                $args['hover-color'] = $color_preset[2];
                $args['hover-border-color'] = $color_preset[3];

            }

            // Previous key is the key of the question.
            $tree_instance[ $current_key ]["answers"][] = [
                "args" => $args,
                "to" => $m[2]
            ];

            return true;

        }

        return false;

    }

}
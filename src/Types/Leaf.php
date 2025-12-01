<?php

namespace InteractiveDecisionTree\Types;
use InteractiveDecisionTree\IDT;

class Leaf extends Abstract_Type {

    public function __construct(){
        parent::__construct( 'leaf', [
            'image_url' => '',
            'back_button' => IDT::$general_settings['back_button'],
        ] );
    }

    public function find_pattern(
        array &$tree_instance,
        string|null &$current_line,
        string|null &$current_type,
        string|null &$current_key
    ): bool {

        if (preg_match('/^\("([^"]+)",(.*)\)$/', $current_line, $m)) {

            $current_key = $m[1];
            $current_type = $this->type_name;

            $args = array_merge( $this->defaults, IDT::parse_args( $m[2] ) );
            $args['back_button'] = IDT::boolean( $args[ 'back_button' ] );

            $tree_instance[ $current_key ] = [
                'type' => $current_type,
                'args' => $args,
                'text' => '',
            ];

            return true;

        }

        return false;

    }

}
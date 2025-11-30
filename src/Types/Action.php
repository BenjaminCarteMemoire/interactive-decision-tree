<?php

namespace InteractiveDecisionTree\Types;
use InteractiveDecisionTree\IDT;

class Action extends Abstract_Type {

    public function __construct(){
        parent::__construct( 'action' );
    }

    public function find_pattern(
        array &$tree_instance,
        string|null &$current_line,
        string|null &$current_type,
        string|null &$current_key
    ): bool {

        if (preg_match('/^\["([^"]+)",(.*)\]\s*=\s*"([^"]+)"$/', $current_line, $m)) {

            $current_key = $m[1];
            $current_type = $this->type_name;
            $tree_instance[ $current_key ] = [
                'type' => $current_type,
                'args' => array_merge( $this->defaults, IDT::parse_args( $m[2] ) ),
                'to' => $m[3],
            ];

            $current_key = $current_type = null; // An action is on a single frame. No need to keep in mind the type or the key.

            return true;

        }

        return false;

    }

}
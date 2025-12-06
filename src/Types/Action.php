<?php

namespace InteractiveDecisionTree\Types;
use InteractiveDecisionTree\Actions\Redirect;
use InteractiveDecisionTree\IDT;

class Action extends Abstract_Type {

    public function __construct(){
        parent::__construct( 'action' );
    }

    public static function get_all_actions(): array {

        return [
            'redirect' => Redirect::class
        ];

    }

    public function find_pattern(
        array &$tree_instance,
        string|null &$current_line,
        string|null &$current_type,
        string|null &$current_key
    ): bool {

        if (preg_match('/^\["([^"]+)",(.*)\]\s*=\s*"([^"]+)"$/', $current_line, $m)) {

            $args = array_merge( $this->defaults, IDT::parse_args( $m[2] ) );
            if( !isset( $args['action_type'] ) )
                return false;

            $good = false;
            $new_args = [] || null;

            foreach ( static::get_all_actions() as $action => $class ) {
                $action_instance = new $class();
                $new_args = $action_instance->parse( $args['action_type'], $args );
                if( is_array( $new_args ) ){
                    $good = true;
                    break;
                }
            }

            if( $good == false )
                return false;

            $current_key = $m[1];
            $current_type = $this->type_name;
            $tree_instance[ $current_key ] = array_merge( $new_args, [
                'type' => $current_type,
                'action' => $args['action_type'],
                'args' =>  $new_args['args'],
                'to' => $m[3],
            ] );

            $current_key = $current_type = null; // An action is on a single frame. No need to keep in mind the type or the key.

            return true;

        }

        return false;

    }

}
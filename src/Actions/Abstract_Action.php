<?php

namespace InteractiveDecisionTree\Actions;

abstract class Abstract_Action {

    public private(set) string $action_name;
    public private(set) array $alias = [];
    public private(set) array $defaults = [];

    public function __construct(
        string $action_name,
        array $alias = [],
        array $defaults = [],
    ){
        $this->action_name = $action_name;
        $this->alias = $alias;
        $this->defaults = $defaults;
    }

    public function parse(
        string $action_name,
        array $args = []
    ): array|null {

        $good_action = false;

        if( $this->action_name != $action_name ){

            foreach( $this->alias as $alias ){
                if( $alias == $action_name ){
                    $good_action = true;
                    break;
                }
            }

        } else
            $good_action = true;

        if( !$good_action )
            return null;

        return $this->do_parse( $args );

    }

    abstract protected function do_parse( array $args = [] ): array|null;

}
<?php

namespace InteractiveDecisionTree\Tags;

abstract class Abstract_Tag {

    public private(set) string $tag_name;
    public private(set) array $alias = [];
    public private(set) array $defaults = [];

    public function __construct( string $tag_name, array $alias = [], array $defaults = [] ) {
        $this->tag_name = $tag_name;
        $this->alias = $alias;
        $this->defaults = $defaults;
    }

    public function replace(
        string $tag_name,
        array $mandatory_params,
        array $args = []
    ): string|null {

        $good_tag = false;

        if( $this->tag_name != $tag_name ){

            foreach( $this->alias as $alias ){
                if( $alias == $tag_name ){
                    $good_tag = true;
                    break;
                }
            }

        } else
            $good_tag = true;

        if( !$good_tag )
            return null;

        return $this->do_replace( $mandatory_params, $args );

    }

    abstract protected function do_replace(
        array $mandatory_params,
        array $args = []
    ): string|null;

}
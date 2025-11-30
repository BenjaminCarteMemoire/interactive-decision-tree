<?php

namespace InteractiveDecisionTree;

class IDT_vars {

    public private(set) int $internal_variable_count;
    public private(set) array $vars = [];

    public function __construct(){

        $this->internal_variable_count = 1;

    }

    public function get( string $key ): string {

        if( $key[0] == '%' )
            $key = substr($key, 1);
        return $this->vars[ $key ] ?? 'undefined';

    }

    public function set( string $key, mixed $value ) : void {

        $this->vars[ $key ] = $value;

    }

    public function set_internal( mixed $value ) : void {

        $this->vars[ strval( $this->internal_variable_count++ ) ] = $value;

    }


}
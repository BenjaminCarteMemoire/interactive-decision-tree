<?php

namespace InteractiveDecisionTree\Types;

abstract class Abstract_Type {

    public private(set) string $type_name;
    public private(set) array $defaults = [];

    public function __construct( string $type_name, array $defaults = [] ) {
        $this->type_name = $type_name;
        $this->defaults = $defaults;
    }

    abstract public function find_pattern(
        array &$tree_instance,
        string|null &$current_line,
        string|null &$current_type,
        string|null &$current_key
    ): bool ;

}
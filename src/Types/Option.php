<?php

namespace InteractiveDecisionTree\Types;
use InteractiveDecisionTree\IDT;
use InteractiveDecisionTree\Tables;

class Option extends Abstract_Type {

    public function __construct(){
        parent::__construct( 'option' );
    }

    public function find_pattern(
        array &$tree_instance,
        string|null &$current_line,
        string|null &$current_type,
        string|null &$current_key
    ): bool {

        if (preg_match('/^@([A-Za-z0-9_%]+):"(.*)"$/', $current_line, $m)) {

            $current_key = $m[1];
            $current_type = $this->type_name;
            $current_value = $m[2];

            $this->execute_option( $current_key, $current_value );

            $current_key = $current_type = null; // An option is on a single frame. No need to keep in mind the type or the key.

            return true;

        }

        return false;

    }

    public function execute_option( string $option, mixed $value ): void{

        // Basic option, SETVAR
        if( preg_match('/^Set%([A-Za-z0-9_]+)$/', $option, $m ) ){
            IDT::$vars->set( $m[1], $value );
            return;
        }

        // Back option, BackOption
        if( $option == 'BackButton' || $option === 'BoutonRetour' ){
            IDT::$general_settings['back_button'] = IDT::boolean( $value );
            return;
        }

        // Visual tree VisualTree
        if( $option == 'VisualTree' || $option == 'ArbreVisuel' ){
            IDT::$general_settings['visual_tree'] = IDT::boolean( $value );
            return;
        }

        // Locale option, Locale
        if( $option == 'Locale' || $option == 'Langue' || $option == 'Region' ){
            IDT::$general_settings['locale'] = Tables::locale( $value );
            return;
        }


    }

}
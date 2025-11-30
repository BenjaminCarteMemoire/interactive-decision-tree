<?php

namespace InteractiveDecisionTree\Tags;
use InteractiveDecisionTree\IDT;

/**
 * Make a text italic.
 *
 * Params :
 *    0 : Text.
 * Args :
 *
 */
class Italic extends Abstract_Tag {

    public function __construct(){
        parent::__construct( 'italic', [
            'I',
            'italique'
        ] );
    }

    protected function do_replace(
        array $mandatory_params,
        array $args = []
    ): string|null {

        // Mandatory params.
        $text = $mandatory_params[0];
        if( $text === '' )
            return null;

        return sprintf( '<span class="IDT_tag_italic">%1$s</span>', $text );

    }


}
<?php

namespace InteractiveDecisionTree\Tags;
use InteractiveDecisionTree\IDT;

/**
 * Make a text bold.
 *
 * Params :
 *    0 : Text.
 * Args :
 *    weight : CSS bold weight (0-900), default: 700
 */
class Bold extends Abstract_Tag {

    public function __construct(){
        parent::__construct( 'bold', [
            'B',
            'gras',
            'G'
        ] );
    }

    protected function do_replace(
        array $mandatory_params,
        array $args = []
    ): string|null {

        // Mandatory params.
        $text = $mandatory_params[0] ?? '';
        if( $text === '' )
            return null;

        $weight = intval( $args['weight'] ?? 700 );

        return htmlspecialchars( sprintf( '<span class="IDT_tag_bold" style="--IDT-bold: %2$d;">%1$s</span>', $text, $weight ), ENT_QUOTES );

    }


}
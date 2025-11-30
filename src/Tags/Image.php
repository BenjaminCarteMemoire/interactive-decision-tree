<?php

namespace InteractiveDecisionTree\Tags;
use InteractiveDecisionTree\IDT;

class Image extends Abstract_Tag {

    public function __construct(){
        parent::__construct( 'image', [
            'IMG'
        ] );
    }

    protected function do_replace(
        array $mandatory_params,
        array $args = []
    ): string|null {

        $image_url = $mandatory_params[0] ?? '';
        if( $image_url === '' )
            return null;

        return htmlspecialchars( sprintf( '<img src="%s"/>', $image_url ), ENT_QUOTES );

    }


}
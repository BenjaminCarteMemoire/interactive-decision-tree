<?php

namespace InteractiveDecisionTree\Tags;
use InteractiveDecisionTree\IDT;

/**
 * Show an image inside a content.
 *
 * Params :
 *      0 : Image URL
 * Args :
 *      width: Image CSS width; Default: auto
 *      height: Image CSS height; Default: auto
 *      max-width: Image CSS max-width; Default: none
 *      max-height: Image CSS max-height; Default: none
 *      center: If the image is in the center; Default: yes
 */
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

        $args['width'] ??= 'auto';
        $args['height'] ??= 'auto';
        $args['max-width'] ??= 'none';
        $args['max-height'] ??= 'none';
        $args['center'] = IDT::boolean( $args['center'] ?? true ) ? 'IDT_image_center' : '';

        return htmlspecialchars(
            sprintf( '<img class="IDT_image %6$s" src="%1$s" style="width:%2$s;height:%3$s;max-width:%4$s;max-height:%5$s"/>',
                $image_url, $args['width'], $args['height'], $args['max-width'], $args['max-height'], $args['center'] ),
        ENT_QUOTES );

    }


}
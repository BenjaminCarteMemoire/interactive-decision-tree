<?php

namespace InteractiveDecisionTree;

class Tables {

    public static function color( string $color ): string{

        $color_table = [

            // Black & White.
            'black' => '#000000',
            'white' => '#ffffff',

            // Red.
            'red' => '#ca4242',
            'border-red' => '#bd3535',
            'hover-red' => '#d26060',
            'hover-border-red' => '#cd4c4c',

            // Green.
            'green' => '#22aa6b',
            'border-green' => '#159d5e',
            'hover-green' => '#2ad585',
            'hover-border-green' => '#1fe086',

        ];

        return $color_table[$color] ?? $color;

    }

    public static function color_preset( string $preset ): array{

        return [ $preset, 'border-' . $preset, 'hover-' . $preset, 'hover-border-' . $preset ];

    }

    /**
     * @param array $tree
     * @param array<string, callable> $methods
     * @return void
     */
    public static function apply( array &$tree, array $methods ): void{

        foreach( $tree as $key => &$value ){

            if( array_key_exists( $key, $methods ) ){

                $value = $methods[ $key ]( $value );

            } elseif( is_array( $value ) ){

                self::apply( $value, $methods );

            }

        }

    }
}
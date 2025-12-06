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

            // Blue.
            'blue' => '#4260f5',
            'border-blue' => '#6e85f7',
            'hover-blue' => '#6e85f7',
            'hover-border-blue' => '#3d5cf5',



        ];

        return $color_table[$color] ?? $color;

    }

    public static function color_preset( string $preset ): array{

        return [ $preset, 'border-' . $preset, 'hover-' . $preset, 'hover-border-' . $preset ];

    }

    public static function locale( string $locale ): string {

        $locale_table = [

            // English
            'en_US' => 'en_US',
            'en' => 'en_US',
            'us' => 'en_US',
            'english' => 'en_US',
            'English' => 'en_US',

            // French
            'fr_FR' => 'fr_FR',
            'fr' => 'fr_FR',
            'FR' => 'fr_FR',
            'france' => 'fr_FR',
            'francais' => 'fr_FR',
            'France' => 'fr_FR',
            'Francais' => 'fr_FR',

        ];

        return $locale_table[ $locale ] ?? 'en_US';

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
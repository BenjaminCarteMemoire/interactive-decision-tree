<?php

namespace InteractiveDecisionTree;

class IDT {

    public static IDT_vars $vars;
    public static array $general_settings = [
        'back_button' => false,
        'visual_tree' => false,
    ];

    public string $filename;
    public private(set) array $tree = [];

    public static function get_all_types() {

        $type_list = [
            Types\Option::class,
            Types\Question::class,
            Types\Leaf::class,
            Types\Action::class,
            Types\Answer::class
        ];

        return $type_list;

    }

    public static function get_all_tags() {

        $tags_list = [
            Tags\Image::class,
            Tags\Bold::class,
            Tags\Italic::class,
        ];

        return $tags_list;

    }

    public static function parse_args( string $s ): array {

        $args = [];
        preg_match_all('/(\w+)\s*:\s*"([^"]*)"/', $s, $m, PREG_SET_ORDER);
        foreach ($m as $match) {
            $args[$match[1]] = $match[2];
        }
        return $args;

    }

    public static function parse_tags_composite( string $line ){

        $blocks = explode( '+', $line );
        $stack = [];
        $i = 0;

        foreach ($blocks as $block) {

            $i++;
            $block = trim($block);

            $block = preg_replace_callback('/%[A-Za-z0-9_]+/', function($m) {
                $key = $m[0];
                return static::$vars->get( $key );
            }, $block);

            $tagged_line = self::parse_tags( $block );

            /*
            if( strpos( $block, '°1' ) !== false ){
                $prev = array_pop( $stack ) ?? '';
                $tagged_line = str_replace( '°1', $prev, $tagged_line );
            }
            */

            // $stack[] = $tagged_line;
            if( count( $blocks ) > $i ) {
                static::$vars->set_internal($tagged_line);
            }

        }

        return $tagged_line;

    }

    public static function parse_tags( string $line ){

        if( $line == '' ) return '';

        return preg_replace_callback( '/\{(.*?)\}/', function($m) {

            $inside = trim( $m[1] );

            if( !preg_match('/^([A-Za-z0-9_]+)\s*,\s*(.*)$/', $inside, $m2) )
                return ""; // Error, no key.w

            $tag_name = $m2[1];
            $global_args = trim( $m2[2] );

            preg_match('/^"([\s\S]*)"$/', $global_args, $m3);
            $mandatory_params = [ $m3[1] ];

            $args = self::parse_args( $global_args );

            foreach( self::get_all_tags() as $tag_class ) {
                $tag_instance = new $tag_class();
                $pre_response = $tag_instance->replace( $tag_name, $mandatory_params, $args );
                if( !is_null( $pre_response ) )
                    return $pre_response;
            }

            return "";

        }, $line );
    }

    public static function boolean( string|bool $bool ): bool {

        if( is_bool( $bool ) )
            return $bool;

        $true = [ 'yes', 'oui', 'Y', 'O', ' y ', ' o ', ' Y ', ' O ', ' Y', ' y', ' O', ' o', 'Y ', 'y ', 'O ', 'o ' ]; // Just for tests...
        return in_array( $bool, $true );
    }

    public function __construct( string $filename )
    {
        $this->filename = $filename;
        static::$vars = new IDT_vars();
        return $this;
    }

    public function read_file(): array {

        $content = file($this->filename, FILE_IGNORE_NEW_LINES);
        return $content;

    }

    public function parse(){

        $this->tree['_internal'] = null;

        $content = $this->read_file();
        $current_key = null;
        $type = null;
        $break = false;

        foreach ($content as $line){

            $line = trim($line);

            // Ignore comments or blank line at first.
            if( $line === '' || $line[0] === '#' )
                continue;

            foreach( self::get_all_types() as $type_class ){

                $type_instance = new $type_class();
                if( $type_instance->find_pattern( $this->tree, $line, $type, $current_key ) ){ // If type is the right one. Stop the loop and go to the next line.
                    $break = true;
                    break;
                }

            }

            if( $break ){ // Go to the next line.
                $break = false;
                continue;
            }

            // EOBlock
            if( $line === '-' ){
                $current_key = null;
                $type = null;
                continue;
            }

            if( $current_key !== null ) { // If it's no type and in a block, it's a text element.

                $tagged_line = self::parse_tags_composite( $line );
                $this->tree[$current_key]["text"] .= $tagged_line . "\n";

            }

        }

        Tables::apply( $this->tree, [
            'color' => fn( string $color ) => Tables::color( $color ),
            'border-color' => fn( string $color ) => Tables::color( $color ),
            'hover-color' => fn( string $color ) => Tables::color( $color ),
            'hover-border-color' => fn( string $color ) => Tables::color( $color ),
        ] );

        $this->tree['_internal']['start'] = 'start';
        $this->tree['_internal']['visual_tree'] = static::$general_settings['visual_tree'];

    }

    public function export_as_json(): string|null {

        return json_encode( $this->tree, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR );

    }


}
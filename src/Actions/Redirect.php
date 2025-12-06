<?php

namespace InteractiveDecisionTree\Actions;

class Redirect extends Abstract_Action {

    public function __construct(){

        parent::__construct(
            'redirect', [
                'redirection',
                'rediriger'
            ],
            [
                'color_preset' => 'none',
                'color' => 'blue',
                'border-color' => 'border-blue',
                'hover-color' => 'hover-blue',
                'hover-border-color' => 'hover-border-blue',
            ]
        );

    }

    protected function do_parse(array $args = []): array|null
    {

        if( !isset( $args['url'] ) && !isset( $args['lien'] ) )
            return null;

        return [
            'url' => $args['url'] ?? $args['lien'] ?? 'none',
            'args' => array_merge( $this->defaults, $args )
        ];

    }

}
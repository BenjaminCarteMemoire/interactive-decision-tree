import {Control} from "./abstract-class-control";
import {IDT_Render, IDT_Route} from "../globals";
import { $ } from '../i18n/locales';

export class Reset extends Control {

    constructor() {
        super( 'reset' );
    }

    def_button(): string {
        return `<a id='IDT_control_reset' class='IDT_controls_button'>${ $.reset }</a>`;
    }

    def_events(): void {

        document.getElementById( 'IDT_control_reset' )?.addEventListener(
            'click', this.reset
        );

    }

    reset( e: Event|null = null ): void {

        if( confirm( "Are you sure you want to reset ?" ) ){
            IDT_Route.prev_section_stack = []; // Reset stack.
            IDT_Route.change_section( IDT_TREE['_internal']['start'] ?? 'start' );
            IDT_Route._goto( IDT_Route.current_section() as string );
        }

    }

}
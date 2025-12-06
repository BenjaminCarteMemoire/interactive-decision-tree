import {Action} from "./abstract-class-action";
import {IDT_Render} from "../globals";
import { $ } from '../i18n/locales';
import {IDT_error_display} from "../utils";


export class Redirect extends Action {

    constructor(){
        super( 'redirect' );
    }

    prepare_goto(e: Event | null, pre_section: string): string {

        return this.current_node['to'] ?? pre_section;

    }

    render( current_node: any ) {

        this.current_node = current_node;
        IDT_Render.MAIN_DIV!.innerHTML +=
            "<div class='IDT_question'>" +
                "<span class='IDT_question_title'>" +
                    $.redirect +
                "</span>" +
                "<span class='IDT_question_subtitle'>" +
                    ( this.current_node['args']['url'] ?? 'Unknown' ) +
                "</span>" +
            "<div id='IDT_QA_buttons', class='IDT_question_answers'></div></div>";

        let IDT_QA_buttons: HTMLElement|null = document.getElementById( 'IDT_QA_buttons');

        if( IDT_QA_buttons === null ){
            IDT_error_display( 'fatal', "IDT Question Answers DIV not found in Redirect Action." );
            return;
        }

        IDT_QA_buttons!.innerHTML += `<a href='${this.current_node['args']['url'] ?? '#'}' class="idt_answer_button" style="
            --IDT-bgcolor:${this.current_node['args']['color'] ?? 'inherit'};
            --IDT-border-color:${this.current_node['args']['border-color'] ?? 'inherit'};
            --IDT-hover-bgcolor:${this.current_node['args']['hover-color'] ?? 'inherit'};
            --IDT-hover-border-color: ${this.current_node['args']['hover-border-color'] ?? 'inherit'};
        " target="_blank">${ $.redirect_button }</a>`;

        IDT_QA_buttons!.innerHTML += `<a class="idt_answer" style="
            --IDT-bgcolor:${this.current_node['args']['continue-color'] ?? '#555'};
            --IDT-border-color:${this.current_node['args']['continue-border-color'] ?? '#444'};
            --IDT-hover-bgcolor:${this.current_node['args']['continue-hover-color'] ?? '#b3b3b3'};
            --IDT-hover-border-color: ${this.current_node['args']['continue-hover-border-color'] ?? '#595959'};
        " data-answer-id="1">${ $.redirect_continue }</a>`;

    }

}
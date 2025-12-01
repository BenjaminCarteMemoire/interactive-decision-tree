import { Question } from "./class-question";
import { IDT_Route, IDT_Render } from "../globals";
import { IDT_error_display, IDT_replace_html, mass_add_remove_events } from "../utils";

export class Leaf extends Question {

    constructor() {
        super( 'leaf' );
    }

    // prepare_goto is the same than Question.

    render(){

        this.set_current_node();
        IDT_Render.MAIN_DIV!.innerHTML +=
            "<div class='IDT_leaf'>" +
                "<span class='IDT_leaf_text'>" +
                    IDT_replace_html( this.current_node['text'] ) +
                "</span><div id='IDT_QA_buttons' class='IDT_question_answers'></div></div>";

        if( this.current_node['args']['back_button'] == true ) {
            let IDT_QA_buttons: HTMLElement|null = document.getElementById( 'IDT_QA_buttons' );
            if( IDT_QA_buttons !== null)
                this.render_back_button(IDT_QA_buttons);
        }

        this.IDT_question_buttons = document.getElementsByClassName( 'idt_answer' );
        mass_add_remove_events(
            this.IDT_question_buttons,
            IDT_Route.goto
        );

    }
}
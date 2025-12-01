import { Type } from "./abstract-class-type";
import { IDT_Route, IDT_Render } from "../globals";
import { IDT_replace_html, IDT_error_display, mass_add_remove_events } from '../utils';

export class Question extends Type {

    IDT_question_buttons: HTMLCollection|undefined;

    constructor( s: string = 'question' ) {
        super( s );
    }

    render_back_button( QA_div: HTMLElement ): void {

        QA_div.innerHTML += `<a class="idt_answer" style="
                            --IDT-bgcolor:#555;
                            --IDT-border-color:#444;
                            --IDT-hover-bgcolor:#b3b3b3;
                            --IDT-hover-border-color:#595959;
                        "data-answer-id="-1">Go back</a>`;
    }

    prepare_goto( e: Event|null, pre_section: string ): string {

        mass_add_remove_events( this.IDT_question_buttons, IDT_Route.goto, true );
        if( e === null ) return pre_section;

        let section: string | undefined;

        let IDT_answer_id: any = e.target?.getAttribute( 'data-answer-id' ) ?? "-1";
        if( IDT_answer_id == "-1" ) {
            section = IDT_Route.prev_section_stack.pop();
        } else {
            IDT_Route.prev_section_stack.push( IDT_Route.current_section() as string );
            section = this.current_node['answers'][IDT_answer_id]['to'];
        }

        return section as string;

    }

    render(): void {

        this.set_current_node();
        IDT_Render.MAIN_DIV!.innerHTML +=
            "<div class='IDT_question'>" +
                "<span class='IDT_question_title'>" +
                    IDT_replace_html( this.current_node['text'] ) +
                "</span>" +
            "<div id='IDT_QA_buttons', class='IDT_question_answers'></div></div>";

        let IDT_answer_id: number = 0;
        let IDT_QA_buttons: HTMLElement|null = document.getElementById( 'IDT_QA_buttons' );

        if( IDT_QA_buttons === null ){
            IDT_error_display( 'fatal', "IDT Question Answers DIV not found." );
            return;
        }

        this.current_node['answers'].forEach( ( IDT_ANSWER: any ) =>{

            IDT_QA_buttons!.innerHTML += `<a class="idt_answer" style="
                            --IDT-bgcolor:${IDT_ANSWER['args']['color'] ?? 'inherit'};
                            --IDT-border-color:${IDT_ANSWER['args']['border-color'] ?? 'inherit'};
                            --IDT-hover-bgcolor:${IDT_ANSWER['args']['hover-color'] ?? 'inherit'};
                            --IDT-hover-border-color: ${IDT_ANSWER['args']['hover-border-color'] ?? 'inherit'};
                        "data-answer-id="${IDT_answer_id++}">${IDT_ANSWER['args']['title']}</a>`;

        });

        if( this.current_node['args']['back_button'] == true )
            this.render_back_button( IDT_QA_buttons );

        this.IDT_question_buttons = document.getElementsByClassName( 'idt_answer' );
        mass_add_remove_events(
            this.IDT_question_buttons,
            IDT_Route.goto
        );

    }
}
import {Type} from "./abstract-class-type";
import {IDT_ACTIONS, IDT_Route} from "../globals";
import {mass_add_remove_events} from "../utils";

export class Action extends Type {

    IDT_question_buttons: any;

    constructor(){
        super( 'action' );
    }

    prepare_goto( e: Event|null, pre_section: string ): string {

        mass_add_remove_events( this.IDT_question_buttons, IDT_Route.goto, true );
        if( e === null ) return pre_section;

        let section = pre_section;

        if( typeof IDT_ACTIONS[ this.current_node['action'] ] !== 'undefined' )
            section = IDT_ACTIONS[ this.current_node['action'] ].prepare_goto( e, pre_section );

        return section as string;

    }

    render(){

        this.set_current_node();

        if( typeof IDT_ACTIONS[ this.current_node['action'] ] !== 'undefined' )
            IDT_ACTIONS[ this.current_node['action'] ].render( this.current_node );

        this.IDT_question_buttons = document.getElementsByClassName( 'idt_answer' );
        mass_add_remove_events(
            this.IDT_question_buttons,
            IDT_Route.goto
        );

    }

}
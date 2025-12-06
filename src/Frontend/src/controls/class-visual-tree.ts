import {Control} from "./abstract-class-control";
import {IDT_Render, IDT_Route, IDT_Visual_Tree} from "../globals";

export class Visual_Tree extends Control {

    constructor() {

        if( IDT_TREE['_internal']['visual_tree'] == true )
            super( 'visual_tree' );

    }

    def_button(): string {
        return "<a id='idt_control_visual_tree' class='IDT_controls_button'>Visual Tree</a>";
    }

    def_events(): void {

        document.getElementById( 'idt_control_visual_tree' )?.addEventListener(
            'click', this.visual_tree
        );
        document.getElementById( 'idt_modal_visual_tree_close')?.addEventListener(
            'click', this.clear_tree
        );

    }

    visual_tree( e: Event|null = null ): void {

        IDT_Visual_Tree.render();
        if( IDT_Render.DIVS![ 'idt_modal_visual_tree' ] !== null )
            IDT_Render.DIVS![ 'idt_modal_visual_tree' ].style.display = 'block';

    }

    clear_tree( e: Event|null = null ): void {

        IDT_Visual_Tree.container.innerHTML = "";
        if( typeof IDT_Visual_Tree.svg !== 'undefined' )
            IDT_Visual_Tree.svg.innerHTML = '';

    }

}
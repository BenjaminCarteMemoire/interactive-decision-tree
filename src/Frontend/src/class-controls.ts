import {IDT_Controls, IDT_CONTROLS, IDT_Render} from "./globals";
import {IDT_error_display} from "./utils";
import {Control} from "./controls/abstract-class-control";

export class Controls {

    readonly CONTAINER: HTMLElement|null|undefined;

    constructor(){

        if( typeof IDT_Render.CONTROLS_DIV === 'undefined' || IDT_Render.CONTROLS_DIV === null ){
            IDT_error_display( 'fatal', "Controls can't be launched. Controls class is called before the Render one.")
            return;
        }

        this.CONTAINER = IDT_Render.CONTROLS_DIV;
        this.CONTAINER!.innerHTML = '<span class="IDT_controls_title">Commands :</span>';

        this.load_controls();

    }

    load_controls(){

        for( const id in IDT_CONTROLS ){
            if( IDT_CONTROLS[id] instanceof Control ) {
                if( typeof IDT_CONTROLS[id].name !== 'undefined' ) {
                    this.CONTAINER!.insertAdjacentHTML("beforeend", IDT_CONTROLS[id].def_button() );
                    IDT_CONTROLS[id].def_events();
                }
            }
        }

    }

}
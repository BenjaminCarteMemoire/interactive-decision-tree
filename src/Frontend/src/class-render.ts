import { IDT_Route, IDT_TYPES } from "./globals";
import { IDT_error_display } from "./utils";

export class Render{

    errcode: number = 0;

    readonly SUPER_GLOBAL_DIV: HTMLElement|null;
    readonly GLOBAL_DIV: HTMLElement|null|undefined;
    readonly CONTROLS_DIV: HTMLElement|null|undefined;
    readonly MAIN_DIV: HTMLElement|null|undefined;
    readonly DIVS: Record<string, HTMLElement|null>|undefined;

    current_node: object|null|undefined;

    constructor(
        super_global_div_name: string = 'idt_container',
        global_div_name: string = 'idt_main',
        main_div_name: string = 'idt_main_frame',
        controls_div_name: string = 'idt_controls'
    ) {

        this.SUPER_GLOBAL_DIV = document.getElementById( super_global_div_name );

        if( !( this.SUPER_GLOBAL_DIV instanceof HTMLElement ) ){

            console.error( `IDT Super global DIV (${super_global_div_name}) not found in the page. Abort.` );
            this.errcode = -1;
            return;

        }

        // Global DIV.
        this.GLOBAL_DIV = document.createElement( "div" );
        this.GLOBAL_DIV.id = global_div_name;
        this.SUPER_GLOBAL_DIV.appendChild( this.GLOBAL_DIV );

        // Controls DIV.
        this.CONTROLS_DIV = document.createElement( "div" );
        this.CONTROLS_DIV.id = controls_div_name;
        this.SUPER_GLOBAL_DIV.appendChild( this.CONTROLS_DIV );

        // Main DIV.
        this.MAIN_DIV = document.createElement( "div" );
        this.MAIN_DIV.id = main_div_name;
        this.GLOBAL_DIV.appendChild( this.MAIN_DIV );

        // Custom DIVs.
        this.DIVS = {};

        this.errcode = 0;
        return;

    }

    add_custom_div(
        custom_div_name: string,
        need_create: boolean = false,
        linked_to: HTMLElement|null|undefined = null
    ): number {

        if( typeof this.DIVS === 'undefined' ){
            console.error( "IDT Divs is not initialized. Abort." );
            this.errcode = -2;
            return this.errcode;
        }

        if( !need_create ){

            this.DIVS[ custom_div_name ] = document.getElementById( custom_div_name );

            if( typeof this.DIVS[ custom_div_name ] === null ){
                console.error( `Custom DIV (${custom_div_name}) may not exist. Abort.` );
                this.errcode = -1;
                return this.errcode;
            }

        } else {

            this.DIVS[ custom_div_name ] = document.createElement( "div" );
            this.DIVS[ custom_div_name ].id = custom_div_name;
            if( linked_to == null )
                linked_to = this.GLOBAL_DIV;

            linked_to?.appendChild( this.DIVS[custom_div_name] );

        }

        return 0;

    }

    add_modal(
        modal_id: string,
        modal_title: string,
        html_element: HTMLElement
    ){

        if( typeof this.DIVS![ 'idt_modal_' + modal_id ] !== 'undefined' )
            return; // Already exists.

        // Parent DIV
        const main_div: HTMLElement = document.createElement( "div" );
        main_div.classList.add( 'IDT_modal' );
        main_div.id = 'idt_modal_' + modal_id;

        // Content DIV
        const content_div: HTMLElement = document.createElement( "div" );
        content_div.classList.add( 'IDT_modal_content' );
        main_div.appendChild( content_div );

        // Header DIV
        const header_div: HTMLElement = document.createElement( "div" );
        header_div.classList.add( 'IDT_modal_header' );
        content_div.appendChild( header_div );

        // Close SPAN
        const close_span: HTMLElement = document.createElement( "span" );
        close_span.classList.add( 'IDT_modal_close' );
        close_span.id = 'idt_modal_' + modal_id + '_close';
        close_span.innerHTML = '×';
        header_div.appendChild( close_span );

        // Close SPAN event.
        close_span.addEventListener( "click", function(){
           main_div.style.display = "none";
        });

        // Header Title
        const header_title: HTMLElement = document.createElement( "h2" );
        header_title.innerHTML = modal_title;
        header_div.appendChild( header_title );

        // Body DIV
        const body_div: HTMLElement = document.createElement( "div" );
        body_div.classList.add( 'IDT_modal_body' );
        body_div.id = 'idt_modal_' + modal_id + '_body';
        body_div.appendChild( html_element );
        content_div.appendChild( body_div );

        this.DIVS!['idt_modal_' + modal_id] = main_div;
        this.GLOBAL_DIV?.appendChild( main_div );
        return;

    }

    render(){

        this.current_node = IDT_TREE[ IDT_Route.current_section() ];
        this.MAIN_DIV!.innerHTML = '';

        try {
            if( typeof this.current_node!.args.title !== 'undefined' )
                this.MAIN_DIV!.innerHTML += "<span class='IDT_title'>" + this.current_node!.args.title + "</span>";
        } catch( e ){
            IDT_error_display( 'fatal', `A requested IDT Node doesn't exist. (${IDT_Route.current_section()}`, e );
            return;
        }

        if( typeof IDT_TYPES[ this.current_node!.type ] !== 'undefined' )
            IDT_TYPES[ this.current_node!.type ].render();

    }

}
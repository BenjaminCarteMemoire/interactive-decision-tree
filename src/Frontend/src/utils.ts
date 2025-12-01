import { IDT_ERROR_CODES, IDT_Render } from "./globals";

export function IDT_read_error_code( errcode: number ): string|undefined {

    const converted_errcode: string = errcode.toString();
    return IDT_ERROR_CODES[ converted_errcode ] ?? 'Errcode not found.';

}

export function IDT_error_display( gravity: string, message: string, js_message: string|null = '', IDT_global_div_name: string|null = 'idt_main' ): void {

    if( gravity !== 'warning' && gravity !== 'fatal' ) gravity = 'fatal';

    if( gravity === 'fatal' ){

        IDT_Render.MAIN_DIV!.innerHTML =
            "<div class='IDT_error IDT_error_fatal'>" +
                message +
                ( js_message != '' ? ( "<hr>" + js_message ) : '' ) +
            "</div>";
        console.error( message, js_message );
        throw new Error( 'IDT stopped due to a fatal error.' );
        return;

    } else if( gravity === 'warning' ){

        IDT_Render.MAIN_DIV!.innerHTML =
            "<div class='IDT_error IDT_error_warning'>" +
                message +
                ( js_message != '' ? ( "<hr>" + js_message ) : '' ) +
            "</div>";
        console.warn( message, js_message );
        return;

    }

}

export function IDT_replace_html( s: string ): string {

    return s.replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");

}

export function mass_add_remove_events(
    mass_bind_list: any,
    callback: CallableFunction,
    remove: boolean = false,
    on: string = "click",
){

    if( remove ){
        for( let i: number = 0; i < mass_bind_list.length; i++ ){
            mass_bind_list[i].removeEventListener( on, callback );
        }
    } else {
        for( let i: number = 0; i < mass_bind_list.length; i++ ){
            mass_bind_list[i].addEventListener( on, callback, false );
        }
    }

}
import { IDT_Render, IDT_Route } from "./globals";

document.addEventListener( 'DOMContentLoaded', function (){

    function IDT(): number|void {

        if( typeof IDT_TREE === 'undefined' ){
            console.error( "The JSON Tree is not defined. Abort." );
            return -1;
        }

        // Begin route.
        IDT_Route.change_section( IDT_TREE['_internal']['start'] ?? 'start' );
        IDT_Route._goto( IDT_Route.current_section() as string );

    }

    IDT();

});
import { IDT_Render, IDT_Route, IDT_Visual_Tree } from "./globals";
import { Visual_Tree } from "./class-visual-tree";
import { Controls } from "./class-controls";
import { IDT_set_locale } from "./i18n/locales";

document.addEventListener( 'DOMContentLoaded', function (){

    function IDT(): number|void {

        if( typeof IDT_TREE === 'undefined' ){
            console.error( "The JSON Tree is not defined. Abort." );
            return -1;
        }

        if( IDT_TREE['_internal']['visual_tree'] == true )
            IDT_Visual_Tree.launch();

        // Begin route.
        IDT_Route.change_section( IDT_TREE['_internal']['start'] ?? 'start' );
        IDT_Route._goto( IDT_Route.current_section() as string );

    }

    IDT();

});
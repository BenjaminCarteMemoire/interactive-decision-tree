import { IDT_Render, IDT_Route } from "./globals";
import {IDT_error_display} from "./utils";

export class Visual_Tree {

    readonly container: HTMLElement;
    readonly container_name: string;
    svg: Element|undefined;

    constructor( container_name = 'idt_visual_tree_frame' ) {

        this.container = document.createElement( "div" );
        this.container_name = container_name;

    }

    launch(){

        this.container!.id = this.container_name as string;
        IDT_Render.add_modal( 'visual_tree', "Visual Tree", this.container );
        IDT_Render.DIVS![ this.container_name ] = this.container;

    }

    render(): void {

        this.container!.innerHTML = `
            <div class="IDT_vs_canvas"></div>
            <svg class="IDT_vs_svg"></svg>
        `;

        const canvas: Element|null = this.container!.querySelector( ".IDT_vs_canvas" );
        const svg: Element|null = this.container!.querySelector( ".IDT_vs_svg" );

        const html_node = this.build_subtree( IDT_Route.current_section() as string );
        if ( !(html_node instanceof HTMLElement) ){
            IDT_error_display( 'fatal', "Error during Visual Tree render." );
            return;
        }
        this.svg = svg as Element;
        canvas?.appendChild( html_node );
        setTimeout(()=> {
            this.draw_tree_connections( this.container as Element, canvas as Element, svg as Element );
        })
    }

    build_subtree( section: string ): HTMLElement|null|undefined {

        const current_node: any = IDT_TREE[ section ];
        if( typeof current_node === "undefined" ){
            IDT_error_display( 'fatal', "A requested IDT Node doesn't exist. (" + section + ')' );
            return null;
        }

        const tree_node: HTMLDivElement = document.createElement( "div" );
        tree_node.className = 'IDT_vs_node';
        tree_node.dataset.id = section;

        tree_node.innerHTML = `
                <div class="IDT_vs_bubble">
                    ${current_node['args']['title'] ?? current_node['text'] ?? 'unknown'}
                </div>
            `;

        const answers: Array<any> = current_node.answers || [];
        if( answers.length > 0 ){

            const children: HTMLDivElement = document.createElement( "div" );
            children.className = 'IDT_vs_children';

            answers.forEach( ans => {
               const child: HTMLElement|null|undefined = this.build_subtree( ans['to'] );
               if( child instanceof HTMLElement )
                   children.appendChild( child );
            });

            tree_node.appendChild( children );

        }

        return tree_node;

    }

    draw_tree_connections( wrapper: Element, canvas: Element, svg: Element ): void {

            svg.innerHTML = "";

            const wrapperRect: any = wrapper.getBoundingClientRect();
            svg.setAttribute("width", wrapperRect.width);
            svg.setAttribute("height", wrapperRect.height);

            const nodes = canvas.querySelectorAll(".IDT_vs_node");

            nodes.forEach(node => {

                const parentBubble = node.querySelector(":scope > .IDT_vs_bubble");
                if (!parentBubble) return;

                const children = node.querySelectorAll(":scope > .IDT_vs_children > .IDT_vs_node");

                const pRect = parentBubble.getBoundingClientRect();

                children.forEach(child => {

                    const childBubble: any = child.querySelector(".IDT_vs_bubble");
                    const cRect = childBubble.getBoundingClientRect();

                    const x1: any = pRect.left + pRect.width/2 - wrapperRect.left;
                    const y1: any = pRect.bottom - wrapperRect.top;

                    const x2: any = cRect.left + cRect.width/2 - wrapperRect.left;
                    const y2: any = cRect.top - wrapperRect.top;

                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", x1);
                    line.setAttribute("y1", y1);
                    line.setAttribute("x2", x2);
                    line.setAttribute("y2", y2);
                    line.setAttribute("stroke", "#888");
                    line.setAttribute("stroke-width", "2");

                    svg.appendChild(line);
                });
            });

        }

}
document.addEventListener( 'DOMContentLoaded', function(){

    let IDT_previous_section = []; // Stack...
    let IDT_section;
    let IDT_super_global_div;
    let IDT_global_div;
    let IDT_controls_div;
    let IDT_div;
    let IDT_click_elements;

    function IDT_error( gravity, message, js_message = '' ){

        if( gravity != 'fatal' && gravity != 'warning' ) gravity = 'fatal';

        if( gravity === 'fatal' ){

            IDT_div.innerHTML = '<div class="IDT_error IDT_error_fatal">' + message + ( js_message != '' ? ( "<hr>" + js_message ) : '' ) +  '</div>';
            console.error( message, js_message );
            throw new Error( 'IDT stopped due to a fatal error.' );
            return;

        } else if (gravity === 'warning' ){

            IDT_div += '<div class="IDT_error IDT_error_warning">' + message + ( js_message != '' ? ( "\n\n" + js_message ) : '' ) +  '</div>';
            console.warn( message, js_message );
            return;

        }

    }

    function IDT_replace_html( s ){

        return s.replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, "&");

    }

    function IDT_goto( node_key ){
        IDT_section = node_key;
        IDT_render_node();
    }

    /**
     * TODO: Do in a modal.
     * TODO: Make a form foreach fields.
     * TODO: Handle actions.
     */
    class IDT_Visual_Tree {

        constructor() {
            this.div = document.createElement("div");
            this.div.id = "idt_visual_tree_frame";
            IDT_global_div.appendChild( this.div );
        }

        render(){

            this.div.innerHTML = `
                <h2 class="IDT_vs_title">Visual Tree</h2>
                <div class="IDT_vs_canvas"></div>
                <svg class="IDT_vs_svg"></svg>
            `;

            const canvas = this.div.querySelector(".IDT_vs_canvas");
            const svg = this.div.querySelector(".IDT_vs_svg");

            const IDT_NODE = this.build_subtree( IDT_section );
            canvas.appendChild( IDT_NODE );

            setTimeout(() => this.draw_tree_connections(this.div, canvas, svg), 50);

        }

        build_subtree( section ){

            const IDT_NODE = IDT_TREE[ section ];
            if( IDT_NODE === 'undefined' ){
                IDT_error( 'fatal', "A requested IDT Node doesn't exist. (" + IDT_section + ')' );
                return;
            }

            const node = document.createElement("div");
            node.className = "IDT_vs_node";
            node.dataset.id = section;

            node.innerHTML = `
                <div class="IDT_vs_bubble">
                    ${IDT_NODE['args']['title'] ?? IDT_NODE['text'] ?? 'unknown'}
                </div>
            `;

            const answers = Object.values(IDT_NODE.answers || {});
            if (answers.length > 0) {

                const children = document.createElement("div");
                children.className = "IDT_vs_children";

                answers.forEach(answer => {
                    const child = this.build_subtree(answer['to']);
                    children.appendChild(child);
                });

                node.appendChild(children);
            }

            return node;

        }

        draw_tree_connections( wrapper, canvas, svg ){

            svg.innerHTML = "";

            const wrapperRect = wrapper.getBoundingClientRect();
            svg.setAttribute("width", wrapperRect.width);
            svg.setAttribute("height", wrapperRect.height);

            const nodes = canvas.querySelectorAll(".IDT_vs_node");

            nodes.forEach(node => {

                const parentBubble = node.querySelector(":scope > .IDT_vs_bubble");
                if (!parentBubble) return;

                const children = node.querySelectorAll(":scope > .IDT_vs_children > .IDT_vs_node");

                const pRect = parentBubble.getBoundingClientRect();

                children.forEach(child => {

                    const childBubble = child.querySelector(".IDT_vs_bubble");
                    const cRect = childBubble.getBoundingClientRect();

                    const x1 = pRect.left + pRect.width/2 - wrapperRect.left;
                    const y1 = pRect.bottom - wrapperRect.top;

                    const x2 = cRect.left + cRect.width/2 - wrapperRect.left;
                    const y2 = cRect.top - wrapperRect.top;

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

        /*

        render(){

            IDT_tree_div.innerHTML = '<h2>Arbre des choix</h2>';

            const ul = this.build_subtree( IDT_section );
            IDT_tree_div.appendChild( ul );
        }

        build_subtree( section ){

            const li = document.createElement("li");
            const IDT_NODE = IDT_TREE[ section ];
            console.log( section );
            li.innerHTML = `<strong>${section}</strong> — ${IDT_NODE['args']['title'] ?? 'undefined'}`;

            const answers = Object.values( IDT_NODE['answers'] || {});
            if (answers.length === 0) return li;

            const ul = document.createElement("ul");
            answers.forEach(a => {
                const child = this.build_subtree( a.to )
                ul.appendChild( child );
            });

            li.append( ul );
            return li;

        }


         */

    }

    /**
     * TODO: Fix alignement problem.
     */
    class IDT_Collapsable_Tree {

        constructor() {
            this.div = document.createElement("div");
            this.div.id = "idt_collapsable_tree_frame";
            IDT_global_div.appendChild( this.div );
        }

        render() {

            this.div.innerHTML = "";
            this.div.appendChild(
                this.build_subtree( IDT_section )
            );

        }

        build_subtree( section, prefix = '', last = true ){

            let hasChildren;
            console.log( section );
            const IDT_NODE = IDT_TREE[section];
            if( !('answers' in IDT_NODE) )
                hasChildren = false;
            else if( IDT_NODE['answers'].length > 0 )
                hasChildren = true;
            else
                hasChildren = false;

            const node = document.createElement("div")
            node.classList.add( "IDT_cs_node" );

            const line = document.createElement( "div" );
            line.classList.add( "IDT_cs_line" );

            const toggle = document.createElement( "span" );
            toggle.classList.add( 'IDT_cs_toggle' );
            toggle.textContent = hasChildren ? "▶ " : "  ";

            const treeChar = last ? "└── " : "├── ";
            line.textContent = prefix + treeChar + ( IDT_NODE['args']['title'] ?? IDT_NODE['text'] ?? 'undefined' ) + "  ";
            line.prepend(toggle);

            node.appendChild( line );
            if( hasChildren ){
                const child = document.createElement( "div" );
                child.classList.add( "IDT_cs_children" );

                const new_prefix = prefix + (last ? "    " : "│   ");
                const answers = Object.values(IDT_NODE.answers || {});

                answers.forEach((answer, i) => {
                    child.appendChild(
                        this.build_subtree( answer['to'], new_prefix, i === answers.length - 1 )
                    );
                });

                node.appendChild( child );
                line.addEventListener( "click", function(){
                   const collapsed = node.classList.toggle("IDT_cs_collapsed");
                   toggle.textContent = collapsed ? "▶ " : "▼ ";
                });
            }

            return node;

        }

    }

    function IDT_render_back_button(){

        document.getElementById( 'IDT_QA_buttons' ).innerHTML += `<a class="idt_answer" style="
                            --IDT-bgcolor:#555;
                            --IDT-border-color:#444;
                            --IDT-hover-bgcolor:#b3b3b3;
                            --IDT-hover-border-color:#595959;
                        "data-answer-id="-1">Go back</a>`;

    }

    function IDT_render_node(){

        const IDT_NODE = IDT_TREE[ IDT_section ];
        IDT_div.innerHTML = "";

        try {
            if (IDT_NODE["args"]["title"] !== "undefined")
                IDT_div.innerHTML += "<span class='IDT_title'>" + IDT_NODE["args"]["title"] + "</span>";
        } catch(e){
            return IDT_error( 'fatal', "A requested IDT Node doesn't exist. (" + IDT_section + ')', e );
        }

        if( IDT_TYPES !== 'undefined' && IDT_TYPES[ IDT_NODE[ "type" ] ]['render'] !== 'undefined' ){
            IDT_TYPES[ IDT_NODE[ "type" ] ]['render']();
        }
    }

    function IDT_bind_click_elements( callback = _IDT_prepare_goto ){

        for( let i = 0; i < IDT_click_elements.length; i++ ){
            IDT_click_elements[i].addEventListener( 'click', callback, false )
        }

    }

    function IDT_unbind_click_elements( callback = _IDT_prepare_goto ){

        for( let i = 0; i < IDT_click_elements.length; i++ ){
            IDT_click_elements[i].removeEventListener( 'click', callback );
        }
        IDT_click_elements = null;

    }

    function _IDT_prepare_goto( event ){

        let IDT_pre_section = "none";
        const IDT_NODE = IDT_TREE[ IDT_section ];

        if( IDT_NODE['type'] === 'question' || IDT_NODE['type'] === 'leaf' ){
            IDT_unbind_click_elements();
            let IDT_answer_id = this.getAttribute( 'data-answer-id' );

            if( IDT_answer_id == -1 ){

                IDT_pre_section = IDT_previous_section.pop();

            } else {

                IDT_previous_section.push( IDT_section ); // Store in memory previous section.
                IDT_pre_section = IDT_NODE['answers'][IDT_answer_id]["to"];

            }

        }

        IDT_goto( IDT_pre_section );

    }

    function IDT( div_container = "idt_container" ){

        if( IDT_TREE === 'undefined' ) {
            console.error( "No JSON defined." );
            return;
        }

        IDT_super_global_div = document.getElementById( div_container );
        if( IDT_super_global_div === "undefined" ){
            console.error( "DIV not defined" )
            return;
        }

        IDT_global_div = document.createElement( "div" );
        IDT_global_div.id = "idt_main";
        IDT_super_global_div.appendChild( IDT_global_div );

        IDT_controls_div = document.createElement( "div" );
        IDT_controls_div.id = "idt_controls";
        IDT_super_global_div.appendChild( IDT_controls_div );
        IDT_controls_div.innerHTML = '<span class="IDT_controls_title">Commandes :</span><a class="IDT_controls_button">Test</a><a class="IDT_controls_button">Test2</a>';

        IDT_div = document.createElement("div");
        IDT_div.id = "idt_main_frame";
        IDT_global_div.appendChild( IDT_div );

        IDT_section = IDT_TREE['_internal']['start'];

        if( IDT_TREE['_internal']['visual_tree'] == true )
            new IDT_Visual_Tree().render();

        IDT_render_node();

    }

    const IDT_TYPES = {
        "question": {
            "render": () => {
                const IDT_NODE = IDT_TREE[ IDT_section ];
                IDT_div.innerHTML +=
                    "<div class='IDT_question'>" +
                        "<span class='IDT_question_title'>" +
                            IDT_replace_html( IDT_NODE["text"] ) +
                    "   </span>" +
                    "<div id='IDT_QA_buttons' class='IDT_question_answers'></div></div>";

                    let IDT_answer_id = 0;
                    let IDT_QA_buttons = document.getElementById( 'IDT_QA_buttons' );

                    IDT_NODE["answers"].forEach( ( IDT_ANSWER ) => {

                        IDT_QA_buttons.innerHTML += `<a class="idt_answer" style="
                            --IDT-bgcolor:${IDT_ANSWER['args']['color'] ?? 'inherit'};
                            --IDT-border-color:${IDT_ANSWER['args']['border-color'] ?? 'inherit'};
                            --IDT-hover-bgcolor:${IDT_ANSWER['args']['hover-color'] ?? 'inherit'};
                            --IDT-hover-border-color: ${IDT_ANSWER['args']['hover-border-color'] ?? 'inherit'};
                        "data-answer-id="${IDT_answer_id++}">${IDT_ANSWER['args']['title']}</a>`;

                    });

                    if( IDT_NODE['args']['back_button'] == true ){
                        IDT_render_back_button();
                    }

                IDT_click_elements = document.getElementsByClassName( 'idt_answer' );
                IDT_bind_click_elements();
            }
        },
        "leaf": {
            "render": () => {
                const IDT_NODE = IDT_TREE[ IDT_section ];
                IDT_div.innerHTML += "<div class='IDT_leaf'>" +
                        "<span class='IDT_leaf_text'>" +
                            IDT_NODE["text"] +
                        "</span><div class='IDT_QA_buttons'></div></div>";

                if( IDT_NODE['args']['back_button'] == true ){
                    IDT_render_back_button();
                }

                IDT_click_elements = document.getElementsByClassName( 'idt_answer' );
                IDT_bind_click_elements();

            }
        }
    }

    IDT();

});


const {commands, view, menu, state, model, keymap, schema_basic,example_setup, schema_list} = PM;

const {Schema} = PM.model;
const {MenuItem, Dropdown, icons} = PM.menu;
const {buildMenuItems, exampleSetup} = PM.example_setup;
const {addListNodes} = PM.schema_list;
const EditorState = state.EditorState;
const EditorView = view.EditorView;
const {schema} = schema_basic;

let availableEditor = document.querySelectorAll('[prosemirror-editor]');

const editorsSchema = []

for(let editor of availableEditor){

    let editorSchema = {
        editor: editor
    }

    let baseSchema = null;

    let customSchema = null;

    let styleAttribute = editor.attributes['prosemirror-available-style'].value


    if(styleAttribute){

        const styles = styleAttribute.split(';')

        //doc, paragraph and text are require to work
        const nodes = {

            doc: {
                content: "block+"
            },

            paragraph: {
                content: "inline*",
                group: "block",
                parseDOM: [{tag: "p"}],
                toDOM() { return ["p", 0] }
            },

            text: {
                group: "inline"
            },

        }

        if(styles.includes('blockquote')){
            nodes.blockquote= {
                content: "block+",
                group: "block",
                defining: true,
                parseDOM: [{tag: "blockquote"}],
                toDOM() { return  ["blockquote", 0] }
            }
        }

        if(styles.includes('horizontal-rule')) {
            nodes.horizontal_rule = {
                group: "block",
                parseDOM:[{tag: "hr"}],
                toDOM(){return ["hr"]}
            }
        }

        if(styles.includes('image')) {
            nodes.image = {
                inline: true,
                attrs: {
                    src: {},
                    alt: {default: null},
                    title: {default: null}
                },
                group: "inline",
                draggable: true,
                parseDOM: [{tag: "img[src]", getAttrs(dom) {
                        return {
                            src: dom.getAttribute("src"),
                            title: dom.getAttribute("title"),
                            alt: dom.getAttribute("alt")
                        }
                    }}],
                toDOM(node) { let {src, alt, title} = node.attrs; return ["img", {src, alt, title}] }
            }
        }

        if(styles.includes('break')){
            nodes.hard_break = {
                inline: true,
                group: "inline",
                selectable: false,
                parseDOM: [{tag: "br"}],
                toDOM() { return ["br"]}
            }
        }

        if(styles.includes('emoji')){
            nodes.emoji= {
                attrs: {type: {default: emojis[0]}},
                inline: true,
                group: "inline",
                draggable: true,

                toDOM: node => ["p", {type: node.attrs.type.emoji}],

                parseDOM: [{
                    tag: "p",
                    getAttrs: dom => {
                        let type = dom.getAttribute("type")
                        dom.innerText = type;
                        return emojis.indexOf(type) > -1 ? {type} : false
                    }
                }]
            }
        }

        if(styles.includes('video-link')){
            nodes.video_link= {

                inline: true,
                attrs: {
                    src: {},
                },
                group: "inline",
                draggable: true,
                parseDOM: [{tag: "img[src]", getAttrs(dom) {
                        return {
                            src: dom.getAttribute("src"),
                        }
                    }}],
                toDOM(node) { let {src} = node.attrs; return ["img", {src}] }

            }
        }



        //marks = toggle the style of element without parent lost (ex: <p>test</p> -> *apply bold* -> <p><b>test</b></p>)
        const marks = {}

        if(styles.includes('bold')){
            marks.strong = {
                parseDOM: [{tag: "b"},{ tag: "strong"},
                    {tag: "b", getAttrs: (node) => node.style.fontWeight !== "normal" && null},
                    {style: "font-weight", getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}],
                toDOM() { return ["b", 0] }
            }
        }

        if(styles.includes('italic')){
            marks.em = {
                parseDOM: [{tag: "i"}, {tag: "em"}, {style: "font-style=italic"}],
                toDOM() { return ["i", 0] }
            }
        }

        if(styles.includes('underline')){

            marks.underline = {
                parseDOM: [{tag: "u"}, {style: "text-decoration: underline"}],
                toDOM() { return ["u", 0] }
            }

        }

        if(styles.includes('code')){
            marks.code=  {
                parseDOM: [{tag: "code"}],
                toDOM() { return ["code", 0] }
            }

        }

        if(styles.includes('link')){
            marks.link= {
                attrs: {
                    href: {},
                },
                inclusive: false,
                parseDOM: [{tag: "a[href]", getAttrs(dom) {
                        return {href: dom.getAttribute("href")}
                    }}],
                toDOM(node) { let {href} = node.attrs; return ["a", {href}, 0] }
            }
        }

        if(styles.includes('list')){

            baseSchema = new Schema({
                nodes,
                marks})


            editorSchema.schema = new Schema({
                nodes: addListNodes(baseSchema.spec.nodes, "paragraph block*", "block"), // adding bullet lists
                marks})

        }else{

            editorSchema.schema = new Schema({
                nodes,
                marks})
        }


    }else{

        //set as default schema if no setup
        const nodes = {
            doc: {
                content: "block+"
            },

            paragraph: {
                content: "inline*",
                group: "block",
                parseDOM: [{tag: "p"}],
                toDOM() { return ["p", 0] }
            },

            text: {
                group: "inline"
            },

            blockquote: {
                content: "block+",
                group: "block",
                defining: true,
                parseDOM: [{tag: "blockquote"}],
                toDOM() { return  ["blockquote", 0] }
            },
            horizontal_rule: {
                group: "block",
                parseDOM:[{tag: "hr"}],
                toDOM(){return ["hr"]}
            },


        }



        const marks = {

        }

        editorSchema.schema = new Schema({
            nodes,
            marks})



    }


    editorsSchema.push(editorSchema);

}





/*
let styles = availableAttrs["available-style"].nodeValue.split(";");

//nodes = assert new node in parent element (ex: insert image in <p>)



*/
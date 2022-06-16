



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


    blockquote: {
        content: "block+",
        group: "block",
        defining: true,
        parseDOM: [{tag: "blockquote"}],
        toDOM() { return  ["blockquote", 0] }
    } ,


    horizontal_rule: {
        group: "block",
        parseDOM: [{tag: "hr"}],
        toDOM() { return ["hr"] }
    },

    heading: {
        attrs: {level: {default: 1}},
        content: "inline*",
        group: "block",
        defining: true,
        parseDOM: [{tag: "h1", attrs: {level: 1}},
            {tag: "h2", attrs: {level: 2}},
            {tag: "h3", attrs: {level: 3}},
            {tag: "h4", attrs: {level: 4}},
            {tag: "h5", attrs: {level: 5}},
            {tag: "h6", attrs: {level: 6}}],
        toDOM(node) { return ["h" + node.attrs.level, 0] }
    },

    code_block: {
        content: "text*",
        marks: "",
        group: "block",
        code: true,
        defining: true,
        parseDOM: [{tag: "pre", preserveWhitespace: "full"}],
        toDOM() { return ["pre", ["code", 0]] }
    },


    text: {
        group: "inline"
    },


    image: {
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
    },

    hard_break: {
        inline: true,
        group: "inline",
        selectable: false,
        parseDOM: [{tag: "br"}],
        toDOM() { return ["br"]}
    },

    emoji:{
        attrs: {type: {default: "🤪"}}, // dynamic values here
        content: "inline",
        group: "block",
        parseDOM: [{ // how does prosemirror recognize an emoji if its being pasted from clipboard?
            tag: "p[emoji-type]",
            getAttrs: (dom) => {
                console.log(dom.getAttribute("emoji-type"))
                return {type: dom.getAttribute("emoji-type")}
            }
        }],
        toDOM: (node) =>  {
            return ["p", node.attrs.type.emoji]
        },
    }
}

const marks = {
    /// A link. Has `href` and `title` attributes. `title`
    /// defaults to the empty string. Rendered and parsed as an `<a>`
    /// element.
    link: {
        attrs: {
            href: {},
            title: {default: null}
        },
        inclusive: false,
        parseDOM: [{tag: "a[href]", getAttrs(dom) {
                return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
            }}],
        toDOM(node) { let {href, title} = node.attrs; return ["a", {href, title}, 0] }
    },

    /// An emphasis mark. Rendered as an `<em>` element. Has parse rules
    /// that also match `<i>` and `font-style: italic`.
    em: {
        parseDOM: [{tag: "i"}, {tag: "em"}, {style: "font-style=italic"}],
        toDOM() { return ["em", 0] }
    },

    /// A strong mark. Rendered as `<strong>`, parse rules also match
    /// `<b>` and `font-weight: bold`.
    strong: {
        parseDOM: [{tag: "strong"},
            // This works around a Google Docs misbehavior where
            // pasted content will be inexplicably wrapped in `<b>`
            // tags with a font-weight normal.
            {tag: "b", getAttrs: (node) => node.style.fontWeight !== "normal" && null},
            {style: "font-weight", getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}],
        toDOM() { return ["strong", 0] }
    } ,

    /// Code font mark. Represented as a `<code>` element.
    code: {
        parseDOM: [{tag: "code"}],
        toDOM() { return ["code", 0] }
    },

    underline:{
        parseDOM: [{tag: "u"}, {style: "font-decoration: underline"}],
        toDOM() { return ["u", 0] }
    }

}

const customSchema = new Schema({nodes, marks})
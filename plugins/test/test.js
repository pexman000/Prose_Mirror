const {buildSchema} =  require("../scripts/schema");
const {ProseMirror} = require("../scripts/proseMirror")
const {buildMenu} = require("../scripts/menuAddon");
const {buildEditor} = require("../scripts/build");
const {translateToBBCode} = require("../scripts/functionAddon");

describe("TEST - ProseMirror custom adaptation", () => {

    describe('Schema builder', () => {

        it('Should have a schema usable', () => {

            let editor = {}

            buildSchema(ProseMirror, editor, ['bold', 'italic', 'image']);

            expect(editor.schema).not.toBeNull()

        })
        it('Should have bold, italic and image', () => {

            let editor = {}

            buildSchema(ProseMirror, editor, ['bold', 'italic', 'image']);

            expect(editor.schema.marks.bold).not.toBeNull()
            expect(editor.schema.marks.italic).not.toBeNull()
            expect(editor.schema.nodes.image).not.toBeNull()

        })

    })


    describe('Menu builder', () => {

        it('Should have a menu usable', () => {

            let editor = {}

            buildSchema(ProseMirror, editor, ['bold', 'italic', 'image']);
            buildMenu(ProseMirror, editor, ['bold', 'italic', 'image']);

            expect(editor.menu).not.toBeNull()

        })

    })

    describe('BBCode parser', () => {

        it('Should parse simples marks ("<x>test</x>" into "[x]test[/x]")', () => {

            expect(translateToBBCode('<p>test</p>')).toBe("test")
            expect(translateToBBCode('<i>test</i>')).toBe("[i]test[/i]")
            expect(translateToBBCode('<u>test</u>')).toBe("[u]test[/u]")
            expect(translateToBBCode('<b>test</b>')).toBe("[b]test[/b]")
            expect(translateToBBCode('<ul>test</ul>')).toBe("[list]test[/list]")
            expect(translateToBBCode('<li>test</li>')).toBe("[*]test")
            expect(translateToBBCode('<h1>test</h1>')).toBe("[b]test[/b]")
            expect(translateToBBCode('<h2>test</h2>')).toBe("[b]test[/b]")
            expect(translateToBBCode('<h3>test</h3>')).toBe("[b]test[/b]")
            expect(translateToBBCode('<h4>test</h4>')).toBe("[b]test[/b]")
            expect(translateToBBCode('<h5>test</h5>')).toBe("[b]test[/b]")
            expect(translateToBBCode('<h6>test</h6>')).toBe("[b]test[/b]")
            expect(translateToBBCode('<code>test</code>')).toBe("[code]test[/code]")
            expect(translateToBBCode('<blockquote>test</blockquote>')).toBe("[quote]test[/quote]")


        })

        it('Should parse more complex marks ("ex: <img src="test">" into "[img]test[/img]")', () => {

            expect(translateToBBCode('<img src="test">')).toBe("[img]test[/img]")
            expect(translateToBBCode('<a href="test">test</a>')).toBe("[url=test]test[/url]")

        })

        it('Should parse in complex situation ("ex: <img src="test"><li><b><ul>test</ul></b></li>" into "[img]test[/img][*][b][list]test[/list][/b]")', () => {

            expect(translateToBBCode('<img src="test"><li><b><ul>test</ul></b></li>')).toBe("[img]test[/img][*][b][list]test[/list][/b]")
            expect(translateToBBCode('<a href="h1">test</a>')).toBe("[url=h1]test[/url]")

        })

    })


    describe('Theme', () => {

        it('Should have the dark theme', () => {

            let editor = {}

            buildSchema(ProseMirror, editor, ['bold', 'italic', 'image']);
            buildMenu(ProseMirror, editor, ['bold', 'italic', 'image']);

            expect(editor.menu).not.toBeNull()

        })

    })


    describe('Editor builder', () => {

        it('Should have a complete editor', () => {

            document.body.innerHTML =
                '<div prosemirror-editor="editor_1" prosemirror-theme="dark" prosemirror-available-style="bold;underline;italic;list;emoji;video-link"></div>\n' +
                '<div prosemirror-content-of="editor_1"></div>'

            let editor = document.querySelector('[prosemirror-editor]')

            buildEditor(ProseMirror, editor)

            expect(document.querySelector('[prosemirror-editor]').children.length).toBeGreaterThan(0)

        })

    })

})


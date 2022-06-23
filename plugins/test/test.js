const {buildSchema} =  require("../scripts/schema");
const {ProseMirror} = require("../scripts/proseMirror")
const {buildMenu, addTheme, applyTheme} = require("../scripts/menuAddon");
const {buildEditor} = require("../scripts/build");
const {translateToBBCode} = require("../scripts/functionAddon");
const {executeSetup} = require("../scripts/setup");

describe("TEST - ProseMirror custom adaptation", () => {

    describe('Schema builder', () => {

        it('Should have a usable schema', () => {

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

        it('Should have italic, underline and blockquote', () => {

            let editor = {}

            buildSchema(ProseMirror, editor, ['italic', 'underline', 'blockquote']);

            expect(editor.schema.marks.italic).not.toBeNull()
            expect(editor.schema.marks.underline).not.toBeNull()
            expect(editor.schema.nodes.blockquote).not.toBeNull()

        })
    })


    describe('Menu builder', () => {

        it('Should have a menu usable', () => {

            let editor = {}

            buildSchema(ProseMirror, editor, ['bold', 'italic', 'image']);
            buildMenu(ProseMirror, editor, ['bold', 'italic', 'image']);

            expect(editor.menu).not.toBeNull()

        })

        it('Should have four sections', () => {

            let editor = {}

            buildSchema(ProseMirror, editor, ['bold', 'italic', 'image']);
            buildMenu(ProseMirror, editor, ['bold', 'italic', 'image']);

            expect(editor.menu.fullMenu.length).toBe(4)

        })

        it('Should have 3 marks', () => {

            let editor = {}

            buildSchema(ProseMirror, editor, ['bold', 'italic', 'image']);
            buildMenu(ProseMirror, editor, ['bold', 'italic', 'image']);

            expect(editor.menu.fullMenu[0].length).toBe(2)

        })

    })



    describe('BBCode parser', () => {

        it('Should parse simples marks (ex: "<x>test</x>" into "[x]test[/x]")', () => {

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

            expect(translateToBBCode('<img src="test"><li><b><ul>test</ul></b></li>'))
                .toBe("[img]test[/img][*][b][list]test[/list][/b]")

            expect(translateToBBCode('<a href="class"><p><b><i><a href="test"></a></i><i><b>test</b></i></b></p></a>'))
                .toBe("[url=class][b][i][url=test][/url][/i][i][b]test[/b][/i][/b][/url]")

        })

    })


    describe('Theme', () => {

        it('Should be able to add a usable theme', () => {

            addTheme("customTheme", "custom-theme")

            let fakeEditor = document.createElement('div');

            applyTheme("customTheme", fakeEditor)

            expect(fakeEditor.classList.contains("custom-theme")).toBe(true);

        })

        it('Should have the dark theme', () => {

            document.body.innerHTML =
                '<div prosemirror-editor="editor_1" prosemirror-theme="dark" prosemirror-available-style="bold;underline;italic;list;emoji;video-link"></div>\n' +
                '<div prosemirror-content-of="editor_1"></div>'

            let editor = document.querySelector('[prosemirror-editor]')

            executeSetup();

            buildEditor(ProseMirror, editor)

            expect(document.querySelector('.dark-theme')).not.toBeNull();


        })

        it('Should have the light theme', () => {

            document.body.innerHTML =
                '<div prosemirror-editor="editor_1" prosemirror-theme="light" prosemirror-available-style="bold;underline;italic;list;emoji;video-link"></div>\n' +
                '<div prosemirror-content-of="editor_1"></div>'

            let editor = document.querySelector('[prosemirror-editor]')

            buildEditor(ProseMirror, editor)

            expect(document.querySelector('.light-theme')).not.toBeNull();


        })


        it('Should have the auto theme', () => {

            document.body.innerHTML =
                '<div prosemirror-editor="editor_1" prosemirror-theme="auto" prosemirror-available-style="bold;underline;italic;list;emoji;video-link"></div>\n' +
                '<div prosemirror-content-of="editor_1"></div>'

            let editor = document.querySelector('[prosemirror-editor]')

            buildEditor(ProseMirror, editor)

            expect(document.querySelector('.auto-theme')).not.toBeNull();


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

        it('Should have a complete menu set', () => {

            document.body.innerHTML =
                '<div prosemirror-editor="editor_1" prosemirror-theme="dark" prosemirror-available-style="bold;underline"></div>\n' +
                '<div prosemirror-content-of="editor_1"></div>'

            let editor = document.querySelector('[prosemirror-editor]')

            buildEditor(ProseMirror, editor)


            expect(document.querySelectorAll('.ProseMirror-menuitem').length).toEqual(9)

        })

    })

})


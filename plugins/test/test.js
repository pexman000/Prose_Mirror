let proseMirror = require('../scripts/proseMirror');
/*
describe('Example test', () => {

    it('should return 3', async () => {
        expect(3).toBe(3)
    })

})

/**
 * BBCode testing
 * check the correct conversion in bbcode from html
 */

describe('TEST - Schema settings', () => {

    document.body.innerHTML = ` 
        <div prosemirror-editor="editor_1" prosemirror-theme="dark" prosemirror-available-style="bold;underline;italic"></div>
        <div prosemirror-content-of="editor_1" ></div>`

    require('../scripts/static-data');
    require('../scripts/proseMirror');
    require('../scripts/schema');
    require('../scripts/menuAddon');
    require('../scripts/build');

    it('should have bold, underline and italic in the toolbar', function () {


        console.log(document.querySelector("[prosemirror-editor]"))

    });


})



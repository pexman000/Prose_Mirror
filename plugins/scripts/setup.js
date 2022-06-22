
const _addTheme = (typeof module !== 'undefined')? require("./menuAddon").addTheme : addTheme;

/**
 *
 */
function setup(){
    //Theming
    _addTheme("dark", "dark-theme");
    _addTheme("light", "light-theme");
    _addTheme("auto", "auto-theme");

}


function executeSetup(){
    setup();
}


if(typeof module !== 'undefined'){//for test purposes
    module.exports.executeSetup = executeSetup;
}
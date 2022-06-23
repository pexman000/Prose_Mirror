
const _addTheme = (typeof module !== 'undefined')? require("./menuAddon").addTheme : addTheme;

let _setup;

/**
 * this contains the default setup of the editor
 */
function defaultSetup(){
    //Theming
    _addTheme("dark", "dark-theme");
    _addTheme("light", "light-theme");
    _addTheme("auto", "auto-theme");

}

/**
 * create a custom setup that can be added after the default one
 *
 * @param {Function} setup callback for the custom setup
 */
function createSetup(setup){
    _setup = setup;
}

/**
 * Execute the setups, the default one and then the custom one (if it exists)
 */
function executeSetup(){
    defaultSetup();
    if(_setup)_setup();
}


if(typeof module !== 'undefined'){//for test purposes
    module.exports.executeSetup = executeSetup;
    module.exports.createSetup = createSetup;
}
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const { commands, workspace } = vscode;
const logging_1 = __webpack_require__(2);
const models_1 = __webpack_require__(3);
const commands_1 = __webpack_require__(6);
function activate(context) {
    logging_1.Logger.info('Hide Secrets is initialized.');
    registerCommands();
}
exports.activate = activate;
function registerCommands() {
    commands.registerCommand(models_1.Commands.hideSecrets, commands_1.hideSecretsHandler);
    commands.registerCommand(models_1.Commands.showSecrets, commands_1.showSecretsHandler);
}
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(1);
class Logger {
    static initialize() {
        if (!this._outputChannel) {
            // Only init once
            this._outputChannel = vscode_1.window.createOutputChannel('Peacock');
        }
    }
    static getChannel() {
        this.initialize();
        return this._outputChannel;
    }
    static info(value, indent = false, title = '') {
        if (title) {
            this._outputChannel.appendLine(title);
        }
        const message = prepareMessage(value, indent);
        this._outputChannel.appendLine(message);
    }
}
exports.Logger = Logger;
function prepareMessage(value, indent) {
    const prefix = indent ? '  ' : '';
    let text = '';
    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            text = `${prefix}${JSON.stringify(value, null, 2)}`;
        }
        else {
            Object.entries(value).map(item => {
                text += `${prefix}${item[0]} = ${item[1]}\n`;
            });
        }
        return text;
    }
    text = `${prefix}${value}`;
    return text;
}
Logger.initialize();


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const constants_1 = __webpack_require__(4);
__export(__webpack_require__(4));
__export(__webpack_require__(5));
function getExtension() {
    let extension;
    const ext = vscode.extensions.getExtension(constants_1.extensionId);
    if (!ext) {
        throw new Error('Extension was not found.');
    }
    if (ext) {
        extension = ext;
    }
    return extension;
}
exports.getExtension = getExtension;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensionShortName = 'hide-secrets';
exports.extensionId = 'johnpapa.vscode-hide-secrets';
exports.timeout = (ms = 200) => __awaiter(void 0, void 0, void 0, function* () { return new Promise(resolve => setTimeout(resolve, ms)); });
exports.isObjectEmpty = (o) => typeof o === 'object' && Object.keys(o).length === 0;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Commands;
(function (Commands) {
    Commands["hideSecrets"] = "hideSecrets.hideSecrets";
    Commands["showSecrets"] = "hideSecrets.showSecrets";
})(Commands = exports.Commands || (exports.Commands = {}));
// export enum Settings {
//   BackgroundColor = 'background'
// }
var Sections;
(function (Sections) {
    Sections["editorTokenColorCustomizationSection"] = "editor.tokenColorCustomizations";
})(Sections = exports.Sections || (exports.Sections = {}));
var TextMateKeys;
(function (TextMateKeys) {
    TextMateKeys["envKeys"] = "string.quoted.double.env,source.env,constant.numeric.env";
    TextMateKeys["envComments"] = "comment.line.number-sign.env";
})(TextMateKeys = exports.TextMateKeys || (exports.TextMateKeys = {}));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = __webpack_require__(7);
const models_1 = __webpack_require__(3);
function hideSecretsHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const value = {
            textMateRules: [
                {
                    scope: models_1.TextMateKeys.envKeys,
                    settings: {
                        foreground: '#19354900'
                    }
                },
                {
                    scope: models_1.TextMateKeys.envComments,
                    settings: {
                        foreground: '#19354900'
                    }
                }
            ]
        };
        yield configuration_1.updateColorConfiguration(value);
    });
}
exports.hideSecretsHandler = hideSecretsHandler;
function showSecretsHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const value = {};
        yield configuration_1.updateColorConfiguration(value);
    });
}
exports.showSecretsHandler = showSecretsHandler;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(8));
__export(__webpack_require__(9));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const models_1 = __webpack_require__(3);
const { workspace } = vscode;
function getColorCustomizationConfig() {
    return workspace.getConfiguration(models_1.Sections.editorTokenColorCustomizationSection);
}
exports.getColorCustomizationConfig = getColorCustomizationConfig;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const vscode_1 = __webpack_require__(1);
const models_1 = __webpack_require__(3);
const logging_1 = __webpack_require__(2);
// export async function updateGlobalConfiguration<T>(setting: Settings, value?: any) {
//   const config = vscode.workspace.getConfiguration();
//   const section = `${extensionShortName}.${setting}`;
//   Logger.info(`${extensionShortName}: Updating the user settings with the following changes:`);
//   if (value && Array.isArray(value) && value.length > 0) {
//     Logger.info(value, true, `${extensionShortName}:  ${section}`);
//   } else {
//     Logger.info(`${extensionShortName}: ${section} = ${value}`, true);
//   }
//   return await config.update(section, value, ConfigurationTarget.Global);
// }
function updateColorConfiguration(colorCustomizations) {
    return __awaiter(this, void 0, void 0, function* () {
        logging_1.Logger.info(`${models_1.extensionShortName}: Updating the workspace with the following color customizations`);
        logging_1.Logger.info(colorCustomizations, true);
        return yield vscode.workspace
            .getConfiguration()
            .update(models_1.Sections.editorTokenColorCustomizationSection, colorCustomizations, vscode_1.ConfigurationTarget.Global);
    });
}
exports.updateColorConfiguration = updateColorConfiguration;


/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map
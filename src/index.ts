import { PreCompiler } from "gherking";
import { /* TODO */ } from "gherkin-ast";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("gpc:template");

// TODO: Add implementation of your precompiler
class Template implements PreCompiler {
    constructor() {
        debug("Intialize");
    }
}

// IMPORTANT: the precompiler class MUST be the export!
export = Template;
/*
 * @example:
 * class MyPrecompiler implements PreCompiler {
 *   constructor(config) {
 *     super();
 *     this.config = config;
 *   }
 * 
 *   onScenario(scenario) {
 *     // doing smth with scenario
 *   }
 * }
 * export = MyPrecompiler
 */
import { PreCompiler } from "gherking";
import { Feature, Rule, Scenario, ScenarioOutline, Tag } from "gherkin-ast";
import { ForLoopConfiguration } from "./types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("gpc:for-loop");

const DEFAULT_CONFIG: ForLoopConfiguration = {
    startIndex: 1,
    maxValue: 10,
    tagName: "loop",
    format: "${name} (${i})",
    limitToMaxValue: true,
};

class ForLoop implements PreCompiler {
    public options: ForLoopConfiguration;

    constructor(options?: Partial<ForLoopConfiguration>) {
        debug("constructor(options: %o)", options);
        this.options = {
            ...DEFAULT_CONFIG,
            ...(options || {}),
        };
        this.verifyOptions();
    }

    private verifyOptions(): void {
        debug("verifyOptions - options: %o", this.options);
        if (typeof this.options.startIndex !== "number" || isNaN(this.options.startIndex)) {
            throw new TypeError(`Start index (${this.options.startIndex}) must be a number!`);
        }
        if (this.options.startIndex < 0) {
            throw new Error(`Start index (${this.options.startIndex}) must be positive!`);
        }
        if (typeof this.options.maxValue !== "number" || isNaN(this.options.maxValue)) {
            throw new TypeError(`Max value (${this.options.maxValue}) must be a number!`);
        }
        if (this.options.maxValue < 0) {
            throw new Error(`Max value (${this.options.maxValue}) must be positive!`);
        }
        if (typeof this.options.format !== "string") {
            throw new TypeError(`Format (${this.options.format}) must be a string!`);
        }
        if (!this.options.format || !this.options.format.trim()) {
            this.options.format = DEFAULT_CONFIG.format;
        }
        if (typeof this.options.tagName !== "string") {
            throw new TypeError(`Tag name (${this.options.tagName}) must be a string!`);
        }
        if (!this.options.tagName || !this.options.tagName.trim()) {
            this.options.tagName = DEFAULT_CONFIG.tagName;
        }
    }

    private isLoopTag(tag: Tag): boolean {
        debug("isLoopTag(tag: %o)", tag);
        return tag.name === this.options.tagName;
    }

    public getIterationNumber<T extends Scenario | ScenarioOutline>(scenario: T): number {
        /* istanbul ignore next */
        debug("getIterationNumber(scenario: %s)", scenario?.constructor.name);
        const loopTag = scenario.tags.find(tag => this.isLoopTag(tag));
        debug("...loopTag: %o", loopTag);
        if (!loopTag || !loopTag.value) {
            return 0;
        }
        const iterator = +loopTag.value;
        debug("...iterator: %o", iterator);
        if (isNaN(iterator)) {
            throw new TypeError(`Iterator (${loopTag.value}) is not a number!`);
        }
        if (iterator > this.options.maxValue) {
            if (this.options.limitToMaxValue) {
                return this.options.maxValue;
            }
            throw new Error(`Iterator (${loopTag.value}) exceeds maximum value of iteration (${this.options.maxValue})!`);
        }
        return iterator;
    }

    private looper<T extends Scenario | ScenarioOutline>(scenario: T): T[] {
        /* istanbul ignore next */
        debug("looper(scenario: %s)", scenario?.constructor.name);
        const n = this.getIterationNumber<T>(scenario);
        debug("...n: %d", n);
        if (n > 0) {
            debug("...tags before: %o", scenario.tags);
            scenario.tags = scenario.tags.filter(tag => !this.isLoopTag(tag));
            debug("...tags after: %o", scenario.tags);

            const start = this.options.startIndex;
            const end = this.options.startIndex + n - 1;
            debug("...start: %d, end: %d", start, end);

            const loopedScenarios: T[] = [];
            for (let i = start; i <= end; i++) {
                debug("......clone %d", i);
                const actualScenario: T = scenario.clone() as T;

                debug("......name original: %s", actualScenario.name);
                actualScenario.name = this.options.format
                    .replace(/\${i}/g, i + "")
                    .replace(/\${name}/g, actualScenario.name);
                debug("......name new: %s", actualScenario.name);
                
                loopedScenarios.push(actualScenario);
            }
            return loopedScenarios;
        }
    }

    public onScenario(s: Scenario, _1: Feature | Rule, _2: number): Scenario[] {
        /* istanbul ignore next */
        debug('onScenario(s: %s)', s?.constructor.name);
        return this.looper<Scenario>(s);
    }
    public onScenarioOutline(so: ScenarioOutline, _1: Feature | Rule, _2: number): ScenarioOutline[] {
        /* istanbul ignore next */
        debug('onScenarioOutline(so: %s)', so?.constructor.name);
        return this.looper<ScenarioOutline>(so);
    }
}

// IMPORTANT: the precompiler class MUST be the export!
export = ForLoop;
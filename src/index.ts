import { Feature, Rule, Scenario, ScenarioOutline, Tag } from "gherkin-ast";
import { PreCompiler } from "gherking";
import { ForLoopConfiguration, ForLoopConfigurationSchema } from "./types";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const debug = require("debug")("gpc:for-loop");

class ForLoop implements PreCompiler {
  public options: ForLoopConfiguration;

  constructor(options?: Partial<ForLoopConfiguration>) {
    debug("constructor(options: %o)", options);
    this.options = ForLoopConfigurationSchema.validateSync(options || {});
  }

  private isLoopTag(tag: Tag): boolean {
    debug("isLoopTag(tag: %o)", tag);
    return tag.name === this.options.tagName;
  }

  public getIterationNumber<T extends Scenario | ScenarioOutline>(scenario: T): number {
    /* istanbul ignore next */
    debug("getIterationNumber(scenario: %s)", scenario?.constructor.name);
    const loopTag = scenario.tags.find((tag) => this.isLoopTag(tag));
    debug("...loopTag: %o", loopTag);
    if (!loopTag || !loopTag.value) {
      return 0;
    }
    let iterator: number;
    // @ts-expect-error Typing of iterations is not correct.
    if (this.options.iterations?.[loopTag.value]) {
      // @ts-expect-error Typing of iterations is not correct.
      iterator = this.options.iterations[loopTag.value];
      debug("...iterator: %o", iterator);
    } else {
      iterator = +loopTag.value;
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
      if (!this.options.keepTag) {
        scenario.tags = scenario.tags.filter((tag) => !this.isLoopTag(tag));
      }
      debug("...tags after: %o", scenario.tags);

      const start = this.options.startIndex;
      const end = this.options.startIndex + n - 1;
      debug("...start: %d, end: %d", start, end);

      const loopedScenarios: T[] = [];
      for (let i = start; i <= end; i++) {
        debug("......clone %d", i);
        const actualScenario: T = scenario.clone() as T;

        debug("......name original: %s", actualScenario.name);
        actualScenario.name = this.options.format.replace(/\${i}/g, i + "").replace(/\${name}/g, actualScenario.name);
        debug("......name new: %s", actualScenario.name);

        loopedScenarios.push(actualScenario);
      }
      return loopedScenarios;
    }
  }

  public onScenario(s: Scenario, _1?: Feature | Rule, _2?: number) {
    /* istanbul ignore next */
    debug("onScenario(s: %s)", s?.constructor.name);
    return this.looper<Scenario>(s);
  }
  public onScenarioOutline(so: ScenarioOutline, _1?: Feature | Rule, _2?: number) {
    /* istanbul ignore next */
    debug("onScenarioOutline(so: %s)", so?.constructor.name);
    return this.looper<ScenarioOutline>(so);
  }
}

export default ForLoop;

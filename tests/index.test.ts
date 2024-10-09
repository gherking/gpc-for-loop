import { Document, pruneID, Scenario, Tag } from "gherkin-ast";
import { load, process } from "gherking";
import ForLoop from "../src";
import { ForLoopConfiguration } from "../src/types";

const loadTestFeatureFile = async (folder: "input" | "expected", file: string): Promise<Document> => {
  const ast: Document[] = pruneID(await load(`./tests/data/${folder}/${file}`)) as Document[];
  return ast[0];
};

const e2eTest = (name: string, options?: ForLoopConfiguration) => {
  return async () => {
    const base = await loadTestFeatureFile("input", `${name}.feature`);
    const expected = await loadTestFeatureFile("expected", `${name}.feature`);
    const actual: Document[] = pruneID(await process(base, new ForLoop(options))) as Document[];

    expect(actual).toHaveLength(1);

    delete actual[0].uri;
    delete actual[0].targetFolder;
    delete actual[0].sourceFolder;
    delete expected.uri;
    delete expected.targetFolder;
    delete expected.sourceFolder;

    expect(actual[0]).toEqual(expected);
  };
};

describe("ForLoop", () => {
  describe("options", () => {
    test("should handle startIndex with incorrect type", () => {
      // @ts-expect-error Passed value is not correct by type definition
      expect(() => new ForLoop({ startIndex: "hello" })).toThrow();
      expect(() => new ForLoop({ startIndex: NaN })).toThrow();
    });

    test("should handle negative startIndex", () => {
      expect(() => new ForLoop({ startIndex: -1 })).toThrow();
    });

    test("should handle maxValue with incorrect type", () => {
      // @ts-expect-error Passed value is not correct by type definition
      expect(() => new ForLoop({ maxValue: "hello" })).toThrow();
      expect(() => new ForLoop({ maxValue: NaN })).toThrow();
    });

    test("should handle negative maxValue", () => {
      expect(() => new ForLoop({ maxValue: -1 })).toThrow();
    });

    test("should handle format with incorrect type", () => {
      // @ts-expect-error Passed value is not correct by type definition
      expect(() => new ForLoop({ format: 42 })).toThrow();
    });

    test("should set default for format in case of explicit empty value", () => {
      const forLoop = new ForLoop({ format: null });
      expect(forLoop.options.format).toEqual("${name} (${i})");
    });

    test("should handle tagName with incorrect type", () => {
      // @ts-expect-error Passed value is not correct by type definition
      expect(() => new ForLoop({ tagName: 42 })).toThrow();
    });

    test("should set default for tagName in case of explicit empty value", () => {
      const forLoop = new ForLoop({ tagName: "" });
      expect(forLoop.options.tagName).toEqual("loop");
    });

    test("should set default options", () => {
      const forLoop = new ForLoop();
      expect(forLoop.options).toEqual({
        format: "${name} (${i})",
        keepTag: false,
        limitToMaxValue: true,
        maxValue: 10,
        startIndex: 1,
        tagName: "loop",
      });
    });
  });

  describe("getIterationNumber", () => {
    let forLoop: ForLoop;
    let scenario: Scenario;

    beforeEach(() => {
      forLoop = new ForLoop({
        iterations: {
          it1: 12,
          it2: 14,
        },
      });
      scenario = new Scenario("Scenario", "test", "");
    });

    test("should handle non-loop tag", () => {
      scenario.tags.push(new Tag("non-loop", "11"));
      expect(forLoop.getIterationNumber(scenario)).toBe(0);
    });

    test("should handle empty loop tag", () => {
      scenario.tags.push(new Tag("loop"));
      expect(forLoop.getIterationNumber(scenario)).toBe(0);
    });

    test("should handle NaN loop value", () => {
      scenario.tags.push(new Tag("loop", "hello"));
      expect(() => forLoop.getIterationNumber(scenario)).toThrow("Iterator (hello) is not a number!");
    });

    test("should handle loop value bigger than max", () => {
      forLoop.options.limitToMaxValue = false;
      scenario.tags.push(new Tag("loop", "11"));
      expect(() => forLoop.getIterationNumber(scenario)).toThrow(
        "Iterator (11) exceeds maximum value of iteration (10)!",
      );
    });

    test("should handle loop value bigger than max", () => {
      scenario.tags.push(new Tag("loop", "11"));
      expect(forLoop.getIterationNumber(scenario)).toBe(10);
    });

    test("should parse loop value", () => {
      scenario.tags.push(new Tag("loop", "10"));
      expect(forLoop.getIterationNumber(scenario)).toBe(10);
    });

    test("should parse iteration value", () => {
      scenario.tags.push(new Tag("loop", "it1"));
      expect(forLoop.getIterationNumber(scenario)).toBe(12);
    });
  });

  describe("e2e", () => {
    test("should handle default config", e2eTest("default"));
    test(
      "should handle custom config",
      e2eTest("custom", {
        maxValue: 4,
        startIndex: 11,
        tagName: "iterate",
        format: "[${i}] ${name}",
        keepTag: true,
      }),
    );
    test(
      "should handle iterations",
      e2eTest("iterations", {
        iterations: {
          stress: 4,
          short: 1,
        },
      }),
    );
  });
});

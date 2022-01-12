import { load, process } from "gherking";
import { Document, pruneID, Scenario, Tag } from "gherkin-ast";
import ForLoop = require("../src");
import { ForLoopConfiguration } from "../src/types";

const loadTestFeatureFile = async (folder: "input" | "expected", file: string): Promise<Document> => {
    const ast: Document[] = pruneID(await load(`./tests/data/${folder}/${file}`)) as Document[];
    delete ast[0].uri;
    return ast[0];
};

const e2eTest = (name: string, options?: ForLoopConfiguration) => {
    return async () => {
        const base = await loadTestFeatureFile("input", `${name}.feature`);
        const expected = await loadTestFeatureFile("expected", `${name}.feature`);
        const actual: Document[] = pruneID(process(base, new ForLoop(options))) as Document[];

        expect(actual).toHaveLength(1);
        expect(actual[0]).toEqual(expected);
    };
};

describe("ForLoop", () => {
    describe("options", () => {
        test("should handle startIndex with incorrect type", () => {
            // @ts-ignore
            expect(() => new ForLoop({ startIndex: "hello" }))
                .toThrow("Start index (hello) must be a number!");

            expect(() => new ForLoop({ startIndex: NaN }))
                .toThrow("Start index (NaN) must be a number!");
        });

        test("should handle negative startIndex", () => {
            expect(() => new ForLoop({ startIndex: -1 }))
                .toThrow("Start index (-1) must be positive!");
        });

        test("should handle maxValue with incorrect type", () => {
            // @ts-ignore
            expect(() => new ForLoop({ maxValue: "hello" }))
                .toThrow("Max value (hello) must be a number!");

            expect(() => new ForLoop({ maxValue: NaN }))
                .toThrow("Max value (NaN) must be a number!");
        });

        test("should handle negative maxValue", () => {
            expect(() => new ForLoop({ maxValue: -1 }))
                .toThrow("Max value (-1) must be positive!");
        });

        test("should handle format with incorrect type", () => {
            // @ts-ignore
            expect(() => new ForLoop({ format: 42 }))
                .toThrow("Format (42) must be a string!");
        });

        test("should set default for format in case of explicit empty value", () => {
            const forLoop = new ForLoop({ format: "" });
            expect(forLoop.options.format).toEqual("${name} (${i})");
        });

        test("should handle tagName with incorrect type", () => {
            // @ts-ignore
            expect(() => new ForLoop({ tagName: 42 }))
                .toThrow("Tag name (42) must be a string!");
        });

        test("should set default for tagName in case of explicit empty value", () => {
            const forLoop = new ForLoop({ tagName: "" });
            expect(forLoop.options.tagName).toEqual("loop");
        });
    });

    describe("getIterationNumber", () => {
        let forLoop: ForLoop;
        let scenario: Scenario;

        beforeEach(() => {
            forLoop = new ForLoop();
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
            expect(() => forLoop.getIterationNumber(scenario))
                .toThrow("Iterator (hello) is not a number!");
        });

        test("should handle loop value bigger than max", () => {
            scenario.tags.push(new Tag("loop", "11"));
            expect(() => forLoop.getIterationNumber(scenario))
                .toThrow("Iterator (11) exceeds maximum value of iteration (10)!");
        });

        test("should parse loop value", () => {
            scenario.tags.push(new Tag("loop", "10"));
            expect(forLoop.getIterationNumber(scenario)).toBe(10);
        });
    });

    describe("e2e", () => {
        test("should handle default config", e2eTest('default'));
        test("should handle custom config", e2eTest('custom', {
            maxValue: 4,
            startIndex: 11,
            tagName: 'iterate',
            format: '[${i}] ${name}'
        }));
    });
});
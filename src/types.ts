import * as yup from "yup";

export const ForLoopConfigurationSchema = yup.object({
  maxValue: yup.number().min(0).integer().default(10).optional(),
  startIndex: yup.number().min(0).integer().default(1).optional(),
  format: yup
    .string()
    .trim()
    .transform((_, originalValue) => originalValue || undefined)
    .default("${name} (${i})")
    .matches(/\$\{name\}/)
    .matches(/\$\{i\}/)
    .optional(),
  tagName: yup
    .string()
    .trim()
    .transform((_, originalValue) => originalValue || undefined)
    .nullable()
    .default("loop")
    .optional(),
  limitToMaxValue: yup.boolean().optional().default(true),
  keepTag: yup.boolean().optional().default(false),
  iterations: yup.lazy((value) => {
    if (value === undefined) {
      // Return a schema that always succeeds if the input is undefined
      return yup.mixed().notRequired();
    } else if (typeof value !== "object" || value === null || Array.isArray(value)) {
      // Return a schema that always fails if the input is not an object
      return yup
        .object()
        .notRequired()
        .test("is-object", "'iterations': Value must be an object", () => false);
    }

    return yup
      .object(
        Object.keys(value).reduce((shape, key) => {
          // @ts-expect-error Shapy does not have an index signature
          shape[key] = yup.number().required();
          return shape;
        }, {}),
      )
      .notRequired();
  }),
});

export type ForLoopConfiguration = yup.InferType<typeof ForLoopConfigurationSchema>;

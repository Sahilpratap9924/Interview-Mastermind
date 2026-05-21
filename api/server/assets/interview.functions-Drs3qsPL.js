import { c as createSsrRpc } from "./createSsrRpc-BtM581fZ.js";
import { r as requireAuth, o as objectType, s as stringType, n as numberType, e as enumType } from "./auth-middleware-BuPT9MPp.js";
import { a0 as createServerFn } from "./server-Pe6FDPZq.js";
const TopicSchema = stringType().min(1).max(60);
const DifficultySchema = enumType(["Easy", "Medium", "Hard"]);
const ObjectIdSchema = stringType().regex(/^[a-f0-9]{24}$/i, "Invalid id");
const startSession = createServerFn({
  method: "POST"
}).middleware([requireAuth]).inputValidator((input) => objectType({
  topic: TopicSchema,
  difficulty: DifficultySchema,
  maxQuestions: numberType().int().min(3).max(10).default(5)
}).parse(input)).handler(createSsrRpc("95625e14c815851be0f806a42bc4c51ee2ec02ae6ffcf4fe5e5942905f04aa9d"));
const submitAnswer = createServerFn({
  method: "POST"
}).middleware([requireAuth]).inputValidator((input) => objectType({
  sessionId: ObjectIdSchema,
  answer: stringType().min(1).max(5e3),
  timeTaken: numberType().int().min(0).max(3600).default(0)
}).parse(input)).handler(createSsrRpc("8ab63f8c7ad7b6c5cbc1638767c518a46b72f5229345c810410a97461fc27e10"));
const listHistory = createServerFn({
  method: "GET"
}).middleware([requireAuth]).handler(createSsrRpc("842094e482f06201c0231819743b02482992efc518cf6affdacf9c100e4e7e35"));
const getSessionDetail = createServerFn({
  method: "POST"
}).middleware([requireAuth]).inputValidator((input) => objectType({
  sessionId: ObjectIdSchema
}).parse(input)).handler(createSsrRpc("68c1a89ff20626e59583a55d4bf07a408e9d7d05a95078bb66758c392f682f66"));
const deleteSession = createServerFn({
  method: "POST"
}).middleware([requireAuth]).inputValidator((input) => objectType({
  sessionId: ObjectIdSchema
}).parse(input)).handler(createSsrRpc("cdbac37975a271cf6d7af2c2b23e20b93ae2f7652902827e27db74e82740959b"));
export {
  submitAnswer as a,
  deleteSession as d,
  getSessionDetail as g,
  listHistory as l,
  startSession as s
};

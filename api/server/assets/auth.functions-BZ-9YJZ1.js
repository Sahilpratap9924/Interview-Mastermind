import { c as createSsrRpc } from "./createSsrRpc-BtM581fZ.js";
import { r as requireAuth, o as objectType, s as stringType } from "./auth-middleware-BuPT9MPp.js";
import { a0 as createServerFn } from "./server-Pe6FDPZq.js";
const EmailSchema = stringType().email().max(254);
const PasswordSchema = stringType().min(6).max(200);
const NameSchema = stringType().min(1).max(80);
const registerUser = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema
}).parse(input)).handler(createSsrRpc("4e578141b0c31f1be17a24a29904665ed85e6a065b6c60f9ec0153df12eda4b3"));
const loginUser = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  email: EmailSchema,
  password: PasswordSchema
}).parse(input)).handler(createSsrRpc("b59a3375a08c64856ea894613f0e719f8529c7d677225e01c6766b177bd6f756"));
const getMe = createServerFn({
  method: "GET"
}).middleware([requireAuth]).handler(createSsrRpc("05d540c91ea9147d57c434f81d698c2e3ff5d23ba136ebab060a4513339a2b8c"));
const changePassword = createServerFn({
  method: "POST"
}).middleware([requireAuth]).inputValidator((input) => objectType({
  oldPassword: PasswordSchema,
  newPassword: PasswordSchema
}).parse(input)).handler(createSsrRpc("99a6241c2e872ac588fb9e911f1c19e326e4ed158596fc59ad6d76613657d027"));
export {
  changePassword as c,
  getMe as g,
  loginUser as l,
  registerUser as r
};

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getDb, ObjectId } from "@/integrations/mongo/client.server";
import { signToken } from "@/integrations/mongo/jwt.server";
import { requireAuth } from "@/integrations/mongo/auth-middleware";

const EmailSchema = z.string().email().max(254);
const PasswordSchema = z.string().min(6).max(200);
const NameSchema = z.string().min(1).max(80);

export const registerUser = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ name: NameSchema, email: EmailSchema, password: PasswordSchema }).parse(input),
  )
  .handler(async ({ data }) => {
    const db = await getDb();
    const users = db.collection("users");
    const email = data.email.toLowerCase().trim();

    const existing = await users.findOne({ email });
    if (existing) throw new Error("An account with that email already exists");

    const password_hash = await bcrypt.hash(data.password, 10);
    const result = await users.insertOne({
      name: data.name,
      email,
      password_hash,
      created_at: new Date(),
    });
    const user = { id: result.insertedId.toHexString(), email, name: data.name };
    const token = signToken({ sub: user.id, email, name: data.name });
    return { token, user };
  });

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ email: EmailSchema, password: PasswordSchema }).parse(input),
  )
  .handler(async ({ data }) => {
    const db = await getDb();
    const users = db.collection("users");
    const email = data.email.toLowerCase().trim();
    const user = await users.findOne({ email });
    if (!user) throw new Error("Invalid email or password");
    const ok = await bcrypt.compare(data.password, user.password_hash as string);
    if (!ok) throw new Error("Invalid email or password");
    const dto = {
      id: (user._id as ObjectId).toHexString(),
      email: user.email as string,
      name: user.name as string | undefined,
    };
    const token = signToken({ sub: dto.id, email: dto.email, name: dto.name });
    return { token, user: dto };
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    return { id: context.userId, email: context.claims.email, name: context.claims.name };
  });

export const changePassword = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input) => z.object({ oldPassword: PasswordSchema, newPassword: PasswordSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(context.userId) });
    if (!user) throw new Error("User not found");
    const ok = await bcrypt.compare(data.oldPassword, user.password_hash as string);
    if (!ok) throw new Error("Invalid current password");
    const newHash = await bcrypt.hash(data.newPassword, 10);
    await users.updateOne({ _id: new ObjectId(context.userId) }, { $set: { password_hash: newHash } });
    return { success: true };
  });

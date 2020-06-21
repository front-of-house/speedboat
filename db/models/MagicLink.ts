import { bookshelf } from "@/db/bookshelf.ts";

export const MagicLink = bookshelf.model("MagicLink", {
  tableName: "magic_link",
  hasTimestamps: true,
});

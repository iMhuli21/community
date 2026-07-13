import {
  pgTable,
  text,
  timestamp,
  index,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  userId: text("user_id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  location: text("location"),
});

export const group = pgTable(
  "group",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    suburb: text("suburb_area").notNull(),
    city_municipality: text("city_municipality").notNull(),
    color: text("color").notNull(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => user.userId, { onDelete: "cascade" }),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("group_userId_indx").on(table.creatorId)],
);

export const memberStatusEnum = pgEnum("member_status", [
  "Mod",
  "Admin",
  "Member",
]);

export const member = pgTable(
  "member",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    joined_at: timestamp("joined_at").defaultNow().notNull(),
    user_id: text("user_id")
      .notNull()
      .references(() => user.userId, { onDelete: "cascade" }),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    status: memberStatusEnum("status").default("Member").notNull(),
    group_id: uuid("group_id")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("member_userId_idx").on(table.user_id),
    index("member_groupId_idx").on(table.group_id),
  ],
);

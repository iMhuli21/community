import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  uuid,
  date,
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
    creatorId: text("creator_id")
      .notNull()
      .references(() => user.userId, { onDelete: "cascade" }),
  },
  (table) => [index("group_userId_indx").on(table.creatorId)],
);

export const userRelations = relations(user, ({ one, many }) => ({
  groups: many(group),
}));

export const groupRelations = relations(group, ({ one, many }) => ({
  user: one(user, {
    fields: [group.creatorId],
    references: [user.userId],
  }),
}));

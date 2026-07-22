import {
  pgSchema,
  pgEnum,
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
  uniqueIndex,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const neonAuth = pgSchema("neon_auth");
export const memberStatus = pgEnum("member_status", ["Mod", "Admin", "Member"]);
export const messageType = pgEnum("message_type", [
  "report",
  "notice",
  "announcement",
  "normal",
]);

export const accountInNeonAuth = neonAuth.table(
  "account",
  {
    id: uuid().defaultRandom().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: uuid()
      .notNull()
      .references(() => userInNeonAuth.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true }).notNull(),
  },
  (table) => [
    index("account_userId_idx").using("btree", table.userId.asc().nullsLast()),
  ],
);

export const invitationInNeonAuth = neonAuth.table(
  "invitation",
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: uuid()
      .notNull()
      .references(() => organizationInNeonAuth.id, { onDelete: "cascade" }),
    email: text().notNull(),
    role: text(),
    status: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    inviterId: uuid()
      .notNull()
      .references(() => userInNeonAuth.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_email_idx").using("btree", table.email.asc().nullsLast()),
    index("invitation_organizationId_idx").using(
      "btree",
      table.organizationId.asc().nullsLast(),
    ),
  ],
);

export const jwksInNeonAuth = neonAuth.table("jwks", {
  id: uuid().defaultRandom().primaryKey(),
  publicKey: text().notNull(),
  privateKey: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
  expiresAt: timestamp({ withTimezone: true }),
});

export const memberInNeonAuth = neonAuth.table(
  "member",
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: uuid()
      .notNull()
      .references(() => organizationInNeonAuth.id, { onDelete: "cascade" }),
    userId: uuid()
      .notNull()
      .references(() => userInNeonAuth.id, { onDelete: "cascade" }),
    role: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull(),
  },
  (table) => [
    index("member_organizationId_idx").using(
      "btree",
      table.organizationId.asc().nullsLast(),
    ),
    index("member_userId_idx").using("btree", table.userId.asc().nullsLast()),
  ],
);

export const organizationInNeonAuth = neonAuth.table(
  "organization",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    slug: text().notNull(),
    logo: text(),
    createdAt: timestamp({ withTimezone: true }).notNull(),
    metadata: text(),
  },
  (table) => [
    uniqueIndex("organization_slug_uidx").using(
      "btree",
      table.slug.asc().nullsLast(),
    ),
    unique("organization_slug_key").on(table.slug),
  ],
);

export const projectConfigInNeonAuth = neonAuth.table(
  "project_config",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    endpointId: text("endpoint_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    trustedOrigins: jsonb("trusted_origins").notNull(),
    socialProviders: jsonb("social_providers").notNull(),
    emailProvider: jsonb("email_provider"),
    emailAndPassword: jsonb("email_and_password"),
    allowLocalhost: boolean("allow_localhost").notNull(),
    pluginConfigs: jsonb("plugin_configs"),
    webhookConfig: jsonb("webhook_config"),
  },
  (table) => [unique("project_config_endpoint_id_key").on(table.endpointId)],
);

export const sessionInNeonAuth = neonAuth.table(
  "session",
  {
    id: uuid().defaultRandom().primaryKey(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    token: text().notNull(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: uuid()
      .notNull()
      .references(() => userInNeonAuth.id, { onDelete: "cascade" }),
    impersonatedBy: text(),
    activeOrganizationId: text(),
  },
  (table) => [
    index("session_userId_idx").using("btree", table.userId.asc().nullsLast()),
    unique("session_token_key").on(table.token),
  ],
);

export const userInNeonAuth = neonAuth.table(
  "user",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean().notNull(),
    image: text(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    role: text(),
    banned: boolean(),
    banReason: text(),
    banExpires: timestamp({ withTimezone: true }),
  },
  (table) => [unique("user_email_key").on(table.email)],
);

export const verificationInNeonAuth = neonAuth.table(
  "verification",
  {
    id: uuid().defaultRandom().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("verification_identifier_idx").using(
      "btree",
      table.identifier.asc().nullsLast(),
    ),
  ],
);

export const group = pgTable(
  "group",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    slug: text().notNull(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => user.userId, { onDelete: "cascade" }),
    description: text().notNull(),
    suburbArea: text("suburb_area").notNull(),
    cityMunicipality: text("city_municipality").notNull(),
    color: text().notNull(),
  },
  (table) => [
    index("group_userId_indx").using(
      "btree",
      table.creatorId.asc().nullsLast(),
    ),
  ],
);

export const member = pgTable(
  "member",
  {
    id: uuid().defaultRandom().primaryKey(),
    joinedAt: timestamp("joined_at")
      .default(sql`now()`)
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.userId, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: memberStatus().default("Member").notNull(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("member_groupId_idx").using("btree", table.groupId.asc().nullsLast()),
    index("member_userId_idx").using("btree", table.userId.asc().nullsLast()),
  ],
);

export const user = pgTable(
  "user",
  {
    name: text().notNull(),
    email: text().notNull(),
    userId: text("user_id").primaryKey(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    location: text(),
  },
  (table) => [unique("user_email_unique").on(table.email)],
);

export const message = pgTable(
  "message",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    body: text("body").notNull(),
    media: text("media").array().notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    type: messageType("type").default("normal").notNull(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    groupId: uuid("group_id")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("message_member_id_idx").using(
      "btree",
      table.memberId.asc().nullsLast(),
    ),
    index("message_groupId_idx").using(
      "btree",
      table.groupId.asc().nullsLast(),
    ),
  ],
);

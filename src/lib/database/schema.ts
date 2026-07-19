import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, check, integer, numeric, uniqueIndex } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  premium: boolean("premium"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// App Tables
export const courses = pgTable(
  "course",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    sks: integer("sks").notNull(),
    lecturerName: text("lecturer_name"),
    room: text("room"),
    status: text("status")
      .notNull()
      .default("aktif"),
    cover: text("cover_url"),
    semester: integer("semester").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("course_userId_code_udx").on(table.userId, table.code),
    index("course_userId_semester_idx").on(table.userId, table.semester),
    check("course_status_check", sql`${table.status} in ('aktif', 'selesai', 'cuti')`),
  ]
);

export const assignments = pgTable(
  "assignment",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    notes: text("notes"),
    taskUrl: text("task_url"),
    status: text("status")
      .notNull()
      .default("todo"),
    priority: text("priority"),
    dueAt: timestamp("due_at", { withTimezone: true }),
    reminderAt: timestamp("reminder_at", { withTimezone: true }),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    grade: numeric("grade", { precision: 5, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("assignment_userId_status_idx").on(table.userId, table.status),
    index("assignment_courseId_idx").on(table.courseId),
    index("assignment_dueAt_idx").on(table.dueAt),
    check(
      "assignment_status_check",
      sql`${table.status} in ('todo', 'in_progress', 'done')`
    ),
    check(
      "assignment_priority_check",
      sql`${table.priority} is null or ${table.priority} in ('low', 'medium', 'high', 'urgent')`
    ),
  ]
);

// App Relations
export const courseRelations = relations(courses, ({ one, many }) => ({
  user: one(user, {
    fields: [courses.userId],
    references: [user.id],
  }),
  assignments: many(assignments),
}));

export const assignmentRelations = relations(assignments, ({ one }) => ({
  user: one(user, {
    fields: [assignments.userId],
    references: [user.id],
  }),
  course: one(courses, {
    fields: [assignments.courseId],
    references: [courses.id],
  }),
}));

export const userAppRelations = relations(user, ({ many }) => ({
  courses: many(courses),
  assignments: many(assignments),
}));

import { z } from "zod";

/* Projects */

export const ProjectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  manager: z.string(),
});

export const DashboardProjectSchema = z.array(
  ProjectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true,
  })
);

export type Project = z.infer<typeof ProjectSchema>;

// Pick -> Permite separar ciertas propiedades de una estructura existente, es decir si tu estructura tiene 5 elementos, y separas 3 de ellos, la nueva estructura solo tendrá esos 3 elementos
// Omit -> Permite quitar ciertas propiedades de una estructura existente, es decir si tu estructura tiene 5 elementos, y quitas 3 de ellos, la nueva estructura tendra todos los elementos menos esos 3 que quitaste
export type ProjectFormData = Pick<
  Project,
  "projectName" | "clientName" | "description"
>;

/* Auth & Users */

const AuthSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
});

type Auth = z.infer<typeof AuthSchema>;
export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegisterForm = Pick<
  Auth,
  "name" | "email" | "password" | "password_confirmation"
>;

export const ProfilePassword = AuthSchema.pick({
  password: true,
  password_confirmation: true,
}).extend({
  current_password: z.string(),
});
export type ProfilePasswordSchema = z.infer<typeof ProfilePassword>;

export type ConfirmToken = Pick<Auth, "token">;

export type RequestConfirmationCodeForm = Pick<Auth, "email">;

export type ForgotPasswordForm = Pick<Auth, "email">;

export type NewPassword = Pick<Auth, "password" | "password_confirmation">;

// Misma funcionalidad que el pick, además se puede agregar(extend) otros campos adicionales
export const UserSchema = AuthSchema.pick({
  name: true,
  email: true,
}).extend({
  _id: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type UserProfileForm = Pick<User, "name" | "email">;

// Team Schema

export const TeamMemberSchema = UserSchema.pick({
  name: true,
  email: true,
  _id: true,
});

export const TeamMembersSchema = z.array(TeamMemberSchema);
export type TeamMembers = z.infer<typeof TeamMembersSchema>;
export type Team = z.infer<typeof TeamMemberSchema>;
export type TeamMemberForm = Pick<Team, "email">;

// Notes

const NoteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: UserSchema,
  task: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;
export type NoteForm = Pick<Note, "content">;

/* Task */

export const TaskStatusSchema = z.enum([
  "pending",
  "onHold",
  "inProgress",
  "underReview",
  "completed",
]);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  status: TaskStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  completedBy: z.array(
    z.object({
      _id: z.string(),
      user: UserSchema,
      status: TaskStatusSchema,
    })
  ),
  notes: z.array(
    NoteSchema.extend({
      createdBy: UserSchema,
    })
  ),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskFormData = Pick<Task, "name" | "description">;

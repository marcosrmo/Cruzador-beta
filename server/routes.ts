import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, type PublicUser } from "@shared/schema";
import bcrypt from "bcryptjs";

// Extend session data
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Helper function to check if user is admin
function isAdminUser(username: string): boolean {
  return username.toLowerCase().includes("admin");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // 🔐 LOGIN
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body as {
        username?: string;
        password?: string;
      };

      if (!username || !password) {
        return res.status(400).json({ error: "Dados inválidos" });
      }

      const user = await storage.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Erro ao salvar sessão" });
        }

        const publicUser: PublicUser = {
          id: user.id,
          username: user.username,
        };

        return res.json({ user: publicUser });
      });

    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Erro interno" });
    }
  });

  // 🔓 LOGOUT
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // 👤 GET CURRENT USER
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const publicUser: PublicUser = {
      id: user.id,
      username: user.username,
    };

    return res.json({ user: publicUser });
  });

  // ➕ CREATE USER (ADMIN ONLY)
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || !isAdminUser(currentUser.username)) {
        return res.status(403).json({
          error: "Acesso negado. Apenas administradores podem criar usuários.",
        });
      }

      const { username, password } = insertUserSchema.parse(req.body);

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ error: "Usuário já existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      const publicUser: PublicUser = {
        id: user.id,
        username: user.username,
      };

      return res.json({ user: publicUser });
    } catch (error) {
      return res.status(400).json({ error: "Dados inválidos" });
    }
  });

  // 📋 LIST USERS (ADMIN ONLY)
  app.get("/api/users", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const currentUser = await storage.getUser(req.session.userId);
    if (!currentUser || !isAdminUser(currentUser.username)) {
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem listar usuários.",
      });
    }

    const allUsers = await storage.getAllUsers();
    const publicUsers: PublicUser[] = allUsers.map((u) => ({
      id: u.id,
      username: u.username,
    }));

    return res.json({ users: publicUsers });
  });

  // 🗑 DELETE USER (ADMIN ONLY)
  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const currentUser = await storage.getUser(req.session.userId);
    if (!currentUser || !isAdminUser(currentUser.username)) {
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem deletar usuários.",
      });
    }

    if (req.params.id === req.session.userId) {
      return res
        .status(400)
        .json({ error: "Não é possível deletar seu próprio usuário" });
    }

    await storage.deleteUser(req.params.id);
    return res.json({ success: true });
  });

  return httpServer;
        }

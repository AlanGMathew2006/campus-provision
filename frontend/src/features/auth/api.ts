import { apiRequest } from "../../services/api";
import type {
  AuthResponse,
  LoginPayload,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  SignupPayload,
} from "./types";

export const loginRequest = (payload: LoginPayload) =>
  apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });

export const signupRequest = (payload: SignupPayload) =>
  apiRequest<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: payload,
  });

export const requestPasswordReset = (payload: PasswordResetRequestPayload) =>
  apiRequest<{ message: string }>("/api/auth/password-reset/request", {
    method: "POST",
    body: payload,
  });

export const confirmPasswordReset = (payload: PasswordResetConfirmPayload) =>
  apiRequest<{ message: string }>("/api/auth/password-reset/confirm", {
    method: "POST",
    body: payload,
  });

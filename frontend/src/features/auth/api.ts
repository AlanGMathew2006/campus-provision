import { apiRequest } from "../../services/api";
import type { AuthResponse, LoginPayload, SignupPayload } from "./types";

export const loginRequest = (payload: LoginPayload) =>
  apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });

export const signupRequest = (payload: SignupPayload) =>
  apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: payload,
  });

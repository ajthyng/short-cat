export interface JWTPayload {
  sub: string
  app: string
  originalUser?: string
}

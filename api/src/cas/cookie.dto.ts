import { CookieOptions, Response } from 'express'

export interface SetCookieDto {
  res: Response
  token: string
  options?: CookieOptions
}

export interface ClearCookieDto {
  res: Response
}

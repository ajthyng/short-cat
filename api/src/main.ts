import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import cookies from 'cookie-parser'
import { AuthGuard } from './authentication/authentication.guard'
import { LoginExceptionFilter } from './exceptions/login-exception.filter'
import { CasService } from './cas/cas.service'
import { AuthnService } from './authentication/authentication.service'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  const authService = new AuthnService()
  const casService = new CasService(authService)
  app.use(cookies())

  const reflector = app.get(Reflector)
  app.useGlobalGuards(new AuthGuard(reflector, authService))
  app.useGlobalFilters(new LoginExceptionFilter(casService))
  await app.listen(3000)
}

bootstrap()

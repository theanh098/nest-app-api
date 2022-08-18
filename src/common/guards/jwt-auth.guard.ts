import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
/**
 * jjj that matches the second argument in PassportStrategy (jjj)
 */
export class JwtAuthGuard extends AuthGuard('jjj') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(
      'user in req in canActive Guard: ',
      context.switchToHttp().getRequest().user,
    );
    /**
     * return true that mean verify valid and validate method is called => next handle request is called
     * and return fasle handle request is still called
     * expried token can be detech in info param
     */
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any, // it is the returns of validate method in strategy or undifined if token is not valid
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    /**
     * affer returning the returns of vadidate method in strategy will be
     * attched to Request object as user property
     * like conext.switchHttp().getRequest().user = user;
     */

    if (info?.message)
      throw new UnauthorizedException({
        message: info.message,
        status: HttpStatus.UNAUTHORIZED,
      });

    return super.handleRequest(err, user, info, context, status);
  }
}

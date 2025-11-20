import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Development mode bypass
    if (process.env.NODE_ENV === "development") {
      const request = context.switchToHttp().getRequest();
      const devUserId = request.headers["x-dev-user-id"] as string;

      if (devUserId) {
        request.user = {
          id: devUserId,
          email: "dev@example.com",
          firstName: "Dev",
          lastName: "User",
          tenants: [],
        };
        return true;
      }
    }

    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw err || new UnauthorizedException("Authentication required");
    }
    return user;
  }
}

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Returns `request.user`. If a key is passed (e.g. `@CurrentUser("id")`),
 * returns just that property. Previously the key was ignored and the full
 * object was always returned — callers that typed the param as `string`
 * ended up passing the whole user object to Prisma.
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as Record<string, unknown> | undefined;
    if (!user) return undefined;
    return typeof data === "string" ? user[data] : user;
  },
);

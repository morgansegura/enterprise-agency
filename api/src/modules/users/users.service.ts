import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByClerkId(clerkUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async update(clerkUserId: string, updateData: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { clerkUserId },
      data: updateData,
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    });

    return user;
  }

  async getUsersForTenant(tenantId: string) {
    const tenantUsers = await this.prisma.tenantUser.findMany({
      where: { tenantId },
      include: {
        user: true,
      },
    });

    return tenantUsers.map((tu) => ({
      ...tu.user,
      role: tu.role,
      permissions: tu.permissions,
      lastActiveAt: tu.lastActiveAt,
    }));
  }
}

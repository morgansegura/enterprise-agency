import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly enabled: boolean;

  constructor(private config: ConfigService) {
    this.fromEmail =
      this.config.get("SMTP_FROM_EMAIL") || "noreply@example.com";
    this.fromName = this.config.get("SMTP_FROM_NAME") || "Web & Funnel";
    this.enabled = this.config.get("ENABLE_EMAIL_NOTIFICATIONS") === "true";

    if (this.enabled) {
      this.transporter = nodemailer.createTransport({
        host: this.config.get("SMTP_HOST"),
        port: parseInt(this.config.get("SMTP_PORT") || "587"),
        secure: this.config.get("SMTP_SECURE") === "true",
        auth: {
          user: this.config.get("SMTP_USER"),
          pass: this.config.get("SMTP_PASS"),
        },
      });

      this.logger.log("Email service initialized");
    } else {
      this.logger.warn("Email notifications are disabled");
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(to: string, token: string): Promise<void> {
    if (!this.enabled) {
      this.logger.warn(
        `Email disabled - Would send verification email to ${to}`,
      );
      return;
    }

    const verificationUrl = `${this.config.get("ADMIN_URL")}/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject: "Verify Your Email Address",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your Email</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
                <h1 style="color: #2563eb; margin-bottom: 20px;">Verify Your Email Address</h1>
                <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
                <div style="margin: 30px 0;">
                  <a href="${verificationUrl}"
                     style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Verify Email
                  </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${verificationUrl}" style="color: #2563eb;">${verificationUrl}</a>
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  This verification link will expire in 24 hours.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                  If you didn't create an account, you can safely ignore this email.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}`, error);
      throw new Error("Failed to send verification email");
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    if (!this.enabled) {
      this.logger.warn(
        `Email disabled - Would send password reset email to ${to}`,
      );
      return;
    }

    const resetUrl = `${this.config.get("ADMIN_URL")}/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject: "Reset Your Password",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
                <h1 style="color: #2563eb; margin-bottom: 20px;">Reset Your Password</h1>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="margin: 30px 0;">
                  <a href="${resetUrl}"
                     style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Reset Password
                  </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  This password reset link will expire in 1 hour.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                  If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}`, error);
      throw new Error("Failed to send password reset email");
    }
  }

  /**
   * Send account exists email (for registration attempts on existing accounts)
   */
  async sendAccountExistsEmail(to: string): Promise<void> {
    if (!this.enabled) {
      this.logger.warn(
        `Email disabled - Would send account exists email to ${to}`,
      );
      return;
    }

    const loginUrl = `${this.config.get("ADMIN_URL")}/login`;

    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject: "Account Already Exists",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Account Already Exists</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
                <h1 style="color: #2563eb; margin-bottom: 20px;">Account Already Exists</h1>
                <p>Someone tried to create an account with this email address, but you already have an account with us.</p>
                <p>If this was you, you can log in using your existing credentials:</p>
                <div style="margin: 30px 0;">
                  <a href="${loginUrl}"
                     style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Log In
                  </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                  If you forgot your password, you can reset it from the login page.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                  If you didn't try to create an account, you can safely ignore this email. This may indicate someone tried to use your email address.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      this.logger.log(`Account exists email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send account exists email to ${to}`, error);
      // Don't throw - this is a nice-to-have notification
    }
  }

  /**
   * Test email connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.enabled) {
      this.logger.warn("Email is disabled, cannot test connection");
      return false;
    }

    try {
      await this.transporter.verify();
      this.logger.log("Email connection test successful");
      return true;
    } catch (error) {
      this.logger.error("Email connection test failed", error);
      return false;
    }
  }
}

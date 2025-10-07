export const jwtConstants = {
  get secret(): string {
    // Provide a sensible default for local development if env var is missing
    return process.env.JWT_SECRET ?? 'default_jwt_secret_change_me';
  },
  get expirationTime(): string {
    // Default to 1h if not provided. JwtService accepts string like '1h' or numeric seconds.
    return process.env.JWT_EXPIRESIN ?? '1h';
  },
};

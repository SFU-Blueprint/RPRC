type AuthLikeUser = {
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
  } | null;
} | null;

export function getUserDisplayName(user: AuthLikeUser): string {
  const metadataName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  if (metadataName && metadataName.trim()) {
    return metadataName.trim();
  }

  const emailName = user?.email?.split('@')[0];
  if (emailName && emailName.trim()) {
    return emailName.trim();
  }

  return 'Member';
}

export function getAvatarFallbackText(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'M';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function getDefaultAvatarUrl(name: string): string {
  const params = new URLSearchParams({ name });
  return `https://ui-avatars.com/api/?${params.toString()}`;
}

const AVATAR_COLORS = ['#3964d8', '#0f766e', '#b45309', '#7c3aed', '#be123c'];

export function getAvatarColor(value: string): string {
  const normalizedValue = value.trim().toUpperCase() || 'U';
  let hash = 0;

  for (const character of normalizedValue) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

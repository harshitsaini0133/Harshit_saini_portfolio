export type ThemePreference = 'system' | 'light' | 'dark';
export const THEME_KEY = 'portfolio-theme';
export function themePreference(value: string | null | undefined): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system';
}
export function resolvedTheme(preference: ThemePreference, dark: boolean) {
  return preference === 'system' ? (dark ? 'dark' : 'light') : preference;
}
export function filterCategory(value: string | null, categories: string[]) {
  return value && categories.includes(value) ? value : 'All';
}

export type AppThemePreference = "system" | "light" | "dark";

export type UserSettings = {
  theme: AppThemePreference;
  preferredLanguage: string;
};

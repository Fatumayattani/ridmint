export const MOCK_USER_ADDRESS = "0x8b6F1A52F94fFF4f5C61B8E1C3bA2d1E78cC33F7";

export function shouldUseMockUser(): boolean {
  const mockFlag = import.meta.env.VITE_USE_MOCK_USER === "true";
  const isDev = import.meta.env.MODE === "development";
  return mockFlag || isDev;
}

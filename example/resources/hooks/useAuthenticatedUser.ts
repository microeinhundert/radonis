import { useGlobals } from "@microeinhundert/radonis";

export function useAuthenticatedUser() {
  const { authenticatedUser } = useGlobals();

  return authenticatedUser;
}

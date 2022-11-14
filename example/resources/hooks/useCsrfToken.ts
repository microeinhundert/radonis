import { useGlobals } from "@microeinhundert/radonis";

export function useCsrfToken() {
  const { csrfToken } = useGlobals();

  return csrfToken;
}

import { useCsrfToken } from '../hooks/useCsrfToken';

/*
 * CSRF Field
 */
function CsrfField() {
  const csrfToken = useCsrfToken();

  return csrfToken ? <input name="_csrf" type="hidden" value={csrfToken} /> : null;
}

export default CsrfField;

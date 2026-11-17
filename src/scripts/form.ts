/**
 * Validation côté client + envoi AJAX vers Formspree (ou tout endpoint compatible).
 * S'applique à tous les formulaires portant l'attribut [data-ajax-form].
 */
const MAX_FILES = 6;
const MAX_TOTAL_MB = 10;

const MESSAGES: Record<string, string> = {
  valueMissing: 'Ce champ est obligatoire.',
  typeMismatchEmail: 'Veuillez saisir une adresse e-mail valide (ex. nom@domaine.fr).',
  typeMismatchUrl: "Veuillez saisir un lien complet, commençant par https://",
  patternMismatchTel: 'Veuillez saisir un numéro de téléphone valide (ex. 06 12 34 56 78).',
  consent: 'Merci de cocher cette case pour que nous puissions traiter votre demande.',
};

function fieldOf(el: Element) {
  return el.closest('.field, .consent-wrap') as HTMLElement | null;
}

function messageFor(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  const v = input.validity;
  if (input instanceof HTMLInputElement && input.type === 'checkbox' && v.valueMissing) return MESSAGES.consent;
  if (v.valueMissing) return MESSAGES.valueMissing;
  if (v.typeMismatch && input.type === 'email') return MESSAGES.typeMismatchEmail;
  if (v.typeMismatch && input.type === 'url') return MESSAGES.typeMismatchUrl;
  if (v.patternMismatch && input.type === 'tel') return MESSAGES.patternMismatchTel;
  return input.validationMessage;
}

function showError(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, msg: string) {
  const wrap = fieldOf(input);
  const out = wrap?.querySelector('.error-msg');
  wrap?.classList.toggle('has-error', !!msg);
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (out) out.textContent = msg;
}

function validateFiles(input: HTMLInputElement): string {
  const files = Array.from(input.files ?? []);
  if (files.length > MAX_FILES) return `Vous pouvez joindre ${MAX_FILES} photos maximum.`;
  if (files.some((f) => !f.type.startsWith('image/'))) return 'Seules les images sont acceptées (JPG, PNG, HEIC…).';
  const total = files.reduce((s, f) => s + f.size, 0) / 1024 / 1024;
  if (total > MAX_TOTAL_MB) return `Le poids total des photos ne doit pas dépasser ${MAX_TOTAL_MB} Mo.`;
  return '';
}

function validate(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
  let msg = input.checkValidity() ? '' : messageFor(input);
  if (!msg && input instanceof HTMLInputElement && input.type === 'file') msg = validateFiles(input);
  showError(input, msg);
  return !msg;
}

document.querySelectorAll<HTMLFormElement>('form[data-ajax-form]').forEach((form) => {
  form.noValidate = true;
  const status = form.querySelector<HTMLElement>('.form-status');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const fields = () => Array.from(form.querySelectorAll<HTMLInputElement>('input:not([type=hidden]):not([name=_gotcha]), select, textarea'));

  // Validation au fil de la saisie (après le premier passage dans le champ)
  fields().forEach((input) => {
    input.addEventListener('blur', () => { if (input.value || input.type === 'checkbox') validate(input); });
    input.addEventListener('input', () => { if (fieldOf(input)?.classList.contains('has-error')) validate(input); });
    input.addEventListener('change', () => { if (input.type === 'file' || input.type === 'checkbox') validate(input); });
  });

  // Liste des photos sélectionnées
  form.querySelectorAll<HTMLInputElement>('input[type=file]').forEach((input) => {
    const list = form.querySelector<HTMLElement>(`[data-file-list="${input.id}"]`);
    input.addEventListener('change', () => {
      if (!list) return;
      list.innerHTML = '';
      Array.from(input.files ?? []).forEach((f) => {
        const li = document.createElement('li');
        li.textContent = `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} Mo)`;
        list.appendChild(li);
      });
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (status) { status.className = 'form-status'; status.textContent = ''; }

    const invalid = fields().filter((input) => !validate(input));
    if (invalid.length) {
      invalid[0].focus();
      if (status) {
        status.className = 'form-status is-error';
        status.textContent = 'Certains champs sont à compléter ou à corriger. Merci de vérifier le formulaire.';
      }
      return;
    }

    const endpoint = form.action;
    if (!endpoint || endpoint.includes('VOTRE_ID_FORMSPREE')) {
      if (status) {
        status.className = 'form-status is-error';
        status.innerHTML = 'Le formulaire n’est pas encore configuré. En attendant, contactez-nous par téléphone ou par e-mail : <a href="' + (form.dataset.fallback ?? '/contact/') + '">voir nos coordonnées</a>.';
      }
      return;
    }

    const label = submit?.innerHTML;
    if (submit) { submit.disabled = true; submit.textContent = 'Envoi en cours…'; }

    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      form.querySelectorAll('[data-file-list]').forEach((l) => (l.innerHTML = ''));
      if (status) {
        status.className = 'form-status is-success';
        status.textContent = 'Merci ! Votre demande a bien été envoyée. Nous revenons vers vous très rapidement.';
        status.focus();
      }
    } catch {
      if (status) {
        status.className = 'form-status is-error';
        status.textContent = "Oups, l'envoi n'a pas abouti. Merci de réessayer dans un instant, ou de nous contacter directement par téléphone ou par e-mail.";
        status.focus();
      }
    } finally {
      if (submit) { submit.disabled = false; if (label) submit.innerHTML = label; }
    }
  });
});

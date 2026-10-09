import { SCHOOL } from './config.js';

const form = document.querySelector('[data-application-form]');
const steps = [...form.querySelectorAll('[data-form-step]')];
const indicators = [...document.querySelectorAll('[data-step-indicator]')];
const status = form.querySelector('[data-form-status]');
const review = form.querySelector('[data-review]');
const classSelect = form.querySelector('[name="classApplyingFor"]');
const classOptions = ['Creche', 'Nursery 1', 'Nursery 2', 'Kindergarten 1', 'Kindergarten 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JHS 1'];
classOptions.forEach((value) => {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  classSelect.append(option);
});
let currentStep = 0;
let submittedAt = 0;
let application = null;
const clean = (value, max = 120) => String(value ?? '').replace(/[<>\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
const namePattern = /^[\p{L}][\p{L} .'-]*$/u;
const phonePattern = /^(?:0\d{9}|\+233\d{9})$/;
const dobField = form.querySelector('[name="childDob"]');
dobField.max = new Date().toISOString().slice(0, 10);
function setStatus(message, kind = 'info', extraNodes = []) {
  status.replaceChildren();
  status.className = `form-status ${kind}`;
  status.hidden = false;
  status.append(document.createTextNode(message));
  extraNodes.forEach((node) => status.append(document.createTextNode(' '), node));
}
function clearStatus() { status.hidden = true; status.replaceChildren(); status.className = 'form-status'; }
function setStep(index) {
  currentStep = index;
  steps.forEach((step, i) => { step.hidden = i !== index; });
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle('active', i === index);
    indicator.classList.toggle('complete', i < index);
    indicator.setAttribute('aria-current', i === index ? 'step' : 'false');
  });
  clearStatus();
  form.querySelector(`[data-form-step="${index}"] h2`)?.focus();
}
function value(name) { return clean(form.elements.namedItem(name)?.value); }
function validateStep(index) {
  let valid = true;
  const controls = [...steps[index].querySelectorAll('input, select')].filter((el) => el.type !== 'hidden' && el.name !== 'botcheck');
  controls.forEach((control) => {
    const error = form.querySelector(`[data-error-for="${control.name}"]`);
    let message = '';
    const val = clean(control.value);
    if (control.required && !val) message = 'Please complete this field.';
    if (!message && ['childFirstName', 'childLastName', 'parentFullName'].includes(control.name) && !namePattern.test(val)) message = 'Use letters, spaces, hyphens, apostrophes or full stops.';
    if (!message && control.name === 'childMiddleName' && val && !namePattern.test(val)) message = 'Please check this name.';
    if (!message && control.name === 'parentPhone' && !phonePattern.test(val.replace(/[\s()-]/g, ''))) message = 'Enter a 10-digit Ghana number or +233 followed by 9 digits.';
    if (!message && control.name === 'parentEmail' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) message = 'Enter a valid email address.';
    if (!message && control.name === 'childDob' && val) {
      const dob = new Date(`${val}T00:00:00`);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
      if (Number.isNaN(dob.getTime()) || dob > today || age < 1 || age > 18) message = 'Enter a valid date of birth for a child aged 1–18.';
    }
    if (error) error.textContent = message;
    control.setAttribute('aria-invalid', String(Boolean(message)));
    if (message) {
      valid = false;
      control.classList.remove('field-shake');
      requestAnimationFrame(() => control.classList.add('field-shake'));
    }
  });
  if (!valid) steps[index].querySelector('[aria-invalid="true"]')?.focus();
  return valid;
}
function snapshot() {
  const childName = [value('childFirstName'), value('childMiddleName'), value('childLastName')].filter(Boolean).join(' ');
  return {
    childName,
    childFirstName: value('childFirstName'),
    childMiddleName: value('childMiddleName'),
    childLastName: value('childLastName'),
    childDob: value('childDob'),
    classApplyingFor: value('classApplyingFor'),
    parentFullName: value('parentFullName'),
    parentPhone: value('parentPhone').replace(/[\s()-]/g, ''),
    parentEmail: value('parentEmail'),
    consent: form.elements.namedItem('consent').checked
  };
}
function drawReview(data) {
  review.replaceChildren();
  const rows = [
    ['Child', data.childName], ['Date of birth', data.childDob],
    ['Class requested', data.classApplyingFor], ['Parent / guardian', data.parentFullName],
    ['Phone', data.parentPhone], ['Email', data.parentEmail || 'Not provided']
  ];
  rows.forEach(([label, text]) => {
    const cell = document.createElement('div');
    cell.className = 'review-item';
    const small = document.createElement('small');
    small.textContent = label;
    const strong = document.createElement('strong');
    strong.textContent = text;
    cell.append(small, strong);
    review.append(cell);
  });
}
function makeWhatsApp(data) {
  const lines = [
    'Hello Green Leaf School, I would like to enquire about admission.',
    `Child: ${data.childName}`,
    `Date of birth: ${data.childDob}`,
    `Class: ${data.classApplyingFor}`,
    `Parent/guardian: ${data.parentFullName}`,
    `Phone: ${data.parentPhone}`,
    ...(data.parentEmail ? [`Email: ${data.parentEmail}`] : [])
  ];
  return `${SCHOOL.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
}
function makeFallbackLinks(data) {
  const wa = document.createElement('a');
  wa.href = makeWhatsApp(data);
  wa.target = '_blank';
  wa.rel = 'noopener noreferrer';
  wa.textContent = 'Send details on WhatsApp';
  wa.className = 'button gold';
  const mail = document.createElement('a');
  mail.href = `mailto:${SCHOOL.email}?subject=${encodeURIComponent('Admission enquiry')}&body=${encodeURIComponent(`Child: ${data.childName}\nDate of birth: ${data.childDob}\nClass: ${data.classApplyingFor}\nParent/guardian: ${data.parentFullName}\nPhone: ${data.parentPhone}`)}`;
  mail.textContent = 'Email the school';
  mail.className = 'text-link';
  return [wa, mail];
}
async function sendApplication(data) {
  if (form.elements.namedItem('botcheck').value) {
    setStatus('Your enquiry could not be processed. Please contact the school directly.', 'error', makeFallbackLinks(data));
    return;
  }
  if (Date.now() - submittedAt < 60000) {
    setStatus('Please wait a moment before sending another enquiry.', 'error', makeFallbackLinks(data));
    return;
  }
  const submit = form.querySelector('[data-submit]');
  submit.disabled = true;
  submit.textContent = 'Sending securely…';
  setStatus('Sending your enquiry…');
  try {
    if (!SCHOOL.web3formsKey || SCHOOL.web3formsKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      throw new Error('Online form delivery is not configured yet.');
    }
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: SCHOOL.web3formsKey,
        subject: `New Admission Application: ${data.childName} (${data.classApplyingFor})`,
        from_name: 'Green Leaf School Website',
        botcheck: '',
        child_first_name: data.childFirstName,
        child_middle_name: data.childMiddleName,
        child_last_name: data.childLastName,
        child_name: data.childName,
        child_date_of_birth: data.childDob,
        class_applying_for: data.classApplyingFor,
        parent_guardian_name: data.parentFullName,
        parent_phone: data.parentPhone,
        parent_email: data.parentEmail,
        consent: data.consent ? 'I confirm the information is correct.' : '',
        ...(data.parentEmail ? { replyto: data.parentEmail } : {})
      })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error('Your enquiry could not be sent right now.');
    submittedAt = Date.now();
    const successScreen = document.querySelector('[data-success-screen]');
    const successSummary = successScreen.querySelector('[data-success-summary]');
    const successWhatsApp = successScreen.querySelector('[data-success-whatsapp]');
    const summaryRows = [
      ['Child', data.childName], ['Date of birth', data.childDob],
      ['Class', data.classApplyingFor], ['Parent / guardian', data.parentFullName],
      ['Contact', data.parentPhone]
    ];
    successSummary.replaceChildren();
    summaryRows.forEach(([label, text]) => {
      const row = document.createElement('p');
      const key = document.createElement('strong');
      key.textContent = `${label}: `;
      row.append(key, document.createTextNode(text));
      successSummary.append(row);
    });
    successWhatsApp.href = makeWhatsApp(data);
    form.hidden = true;
    successScreen.hidden = false;
    successScreen.querySelector('h2').focus();
    window.open(successWhatsApp.href, '_blank', 'noopener');
    submit.textContent = 'Enquiry sent';
    form.querySelectorAll('input, select, button').forEach((field) => { if (field !== submit) field.disabled = true; });
  } catch (error) {
    setStatus(`${error.message} Your details are still here; try WhatsApp or email instead.`, 'error', makeFallbackLinks(data));
    submit.disabled = false;
    submit.textContent = 'Try again';
  }
}
form.addEventListener('click', (event) => {
  const next = event.target.closest('[data-next]');
  const back = event.target.closest('[data-back]');
  if (next) {
    if (!validateStep(currentStep)) return;
    if (currentStep === 1) {
      application = snapshot();
      drawReview(application);
    }
    setStep(Math.min(currentStep + 1, steps.length - 1));
  }
  if (back) setStep(Math.max(0, currentStep - 1));
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (currentStep !== 2) return;
  if (!form.elements.namedItem('consent').checked) {
    form.elements.namedItem('consent').focus();
    setStatus('Please confirm that the school may use these details to respond to your enquiry.', 'error');
    return;
  }
  application = snapshot();
  sendApplication(application);
});
form.addEventListener('input', (event) => {
  const control = event.target;
  if (!control.matches('input,select') || control.name === 'botcheck') return;
  const error = form.querySelector(`[data-error-for="${control.name}"]`);
  let message = '';
  const val = clean(control.value);
  if (val) {
    if (['childFirstName', 'childLastName', 'parentFullName'].includes(control.name) && !namePattern.test(val)) message = 'Use letters, spaces, hyphens, apostrophes or full stops.';
    if (control.name === 'childMiddleName' && !namePattern.test(val)) message = 'Please check this name.';
    if (control.name === 'parentPhone' && !phonePattern.test(val.replace(/[\s()-]/g, ''))) message = 'Enter a 10-digit Ghana number or +233 followed by 9 digits.';
    if (control.name === 'parentEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) message = 'Enter a valid email address.';
    if (control.name === 'childDob') {
      const dob = new Date(`${val}T00:00:00`);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
      if (Number.isNaN(dob.getTime()) || dob > today || age < 1 || age > 18) message = 'Enter a valid date of birth for a child aged 1–18.';
    }
  }
  control.setAttribute('aria-invalid', String(Boolean(message)));
  if (error) error.textContent = message;
  if (message) {
    control.classList.remove('field-shake');
    requestAnimationFrame(() => control.classList.add('field-shake'));
  } else {
    control.classList.remove('field-shake');
  }
});
setStep(0);

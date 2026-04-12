'use client';

import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { submitContactForm } from '@/lib/db/actions';

function formatPhone(value: string): string {
  // Extract digits only
  let digits = value.replace(/\D/g, '');

  // Ensure starts with 7
  if (digits.length === 0) return '';
  if (digits[0] !== '7') {
    digits = '7' + digits;
  }

  // Cap at 11 digits
  digits = digits.slice(0, 11);

  // Format progressively
  if (digits.length <= 1) return '+7';
  if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
  if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
}

export function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const loadTimeRef = useRef(Date.now());

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};

    if (name.trim().length < 2) {
      errs.name = 'Введите ваше имя';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11 || phoneDigits[0] !== '7') {
      errs.phone = 'Введите корректный номер телефона';
    }

    if (!interest) {
      errs.interest = 'Выберите направление';
    }

    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');

    // Client-side honeypot check (fast rejection, no network)
    if (website) {
      setFormState('success');
      return;
    }

    // Client-side timing check (fast rejection, no network)
    if (Date.now() - loadTimeRef.current < 3000) {
      setFormState('success');
      return;
    }

    // Client-side validation (immediate feedback)
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFormState('submitting');

    const result = await submitContactForm({
      name,
      phone,
      specialization: interest,
      description,
      honeypot: website,
      loadTime: loadTimeRef.current,
    });

    if (result.success) {
      setFormState('success');
    } else if (result.errors) {
      if (result.errors._form) {
        setFormError(result.errors._form);
      }
      // Merge server-side field errors (name, phone, specialization)
      const fieldErrors = Object.fromEntries(
        Object.entries(result.errors).filter(([key]) => key !== '_form')
      );
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }
      setFormState('idle');
    }
  }

  if (formState === 'success') {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-3xl z-20 flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-white/80 border border-white/60 rounded-full flex items-center justify-center mb-6 shadow-glass-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--mu-green-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <h3 className="text-3xl font-extrabold text-mu-text-900 mb-3">
          Спасибо!
        </h3>
        <p className="text-mu-text-700 font-medium text-center">
          Мы{'\u00A0'}свяжемся с{'\u00A0'}вами в{'\u00A0'}течение 24{'\u00A0'}часов.
        </p>
      </div>
    );
  }

  const inputBase = 'w-full px-5 py-4 rounded-2xl border bg-white/50 backdrop-blur-md focus:bg-white/70 focus:border-mu-blue focus:ring-4 focus:ring-mu-blue/20 outline-none transition-all placeholder:text-mu-text-500 font-medium text-mu-text-900 shadow-glass-inner';
  const inputNormal = `${inputBase} border-white/40`;
  const inputError = `${inputBase} border-red-400`;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-sm font-bold text-mu-text-900 mb-2">
            Ваше имя
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            required
            placeholder="Например, Айгуль"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => { const next = { ...prev }; delete next.name; return next; });
            }}
            className={errors.name ? inputError : inputNormal}
          />
          {errors.name && <span className="text-sm text-red-500 mt-1 block" role="alert">{errors.name}</span>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-bold text-mu-text-900 mb-2">
            Телефон
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="numeric"
            required
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPhone(formatPhone(e.target.value));
              if (errors.phone) setErrors(prev => { const next = { ...prev }; delete next.phone; return next; });
            }}
            className={errors.phone ? inputError : inputNormal}
          />
          {errors.phone && <span className="text-sm text-red-500 mt-1 block" role="alert">{errors.phone}</span>}
        </div>

        {/* Interest */}
        <div>
          <label htmlFor="contact-interest" className="block text-sm font-bold text-mu-text-900 mb-2">
            Что вас интересует
          </label>
          <select
            id="contact-interest"
            name="interest"
            required
            value={interest}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setInterest(e.target.value);
              if (errors.interest) setErrors(prev => { const next = { ...prev }; delete next.interest; return next; });
            }}
            className={`${errors.interest ? inputError : inputNormal} appearance-none`}
          >
            <option value="" disabled>Выберите направление</option>
            <option value="consultation">Онлайн-консультация</option>
            <option value="treatment">Лечение за рубежом</option>
            <option value="checkup">Чек-ап</option>
            <option value="not-sure">Пока не определился</option>
          </select>
          {errors.interest && <span className="text-sm text-red-500 mt-1 block" role="alert">{errors.interest}</span>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="contact-description" className="block text-sm font-bold text-mu-text-900 mb-2">
            Кратко о{'\u00A0'}вашем случае <span className="text-mu-text-500 font-medium">(необязательно)</span>
          </label>
          <textarea
            id="contact-description"
            name="description"
            rows={4}
            placeholder="Опишите вашу ситуацию или вопрос"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            className={inputNormal}
          />
        </div>

        {/* Honeypot */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
          />
        </div>

        {/* Form-level error */}
        {formError && (
          <div className="text-sm text-red-500 text-center p-3 bg-red-50 rounded-lg" role="alert">
            {formError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={formState === 'submitting'}
          className="w-full bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white py-4 rounded-2xl font-bold shadow-[0_16px_32px_color-mix(in_oklch,var(--color-mu-blue)_30%,transparent)] shadow-glass-inner hover:shadow-[0_20px_40px_color-mix(in_oklch,var(--color-mu-blue)_40%,transparent)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-8"
        >
          {formState === 'submitting' ? 'Отправка...' : 'Отправить заявку'}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m22 2-7 20-4-9-9-4Z"/>
            <path d="M22 2 11 13"/>
          </svg>
        </button>
      </form>

      <p className="text-sm text-mu-text-700 font-medium text-center mt-4">
        Мы{'\u00A0'}перезвоним в{'\u00A0'}течение 24{'\u00A0'}часов. Ваши данные защищены.
      </p>
    </>
  );
}

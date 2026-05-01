'use server';

import { db } from './index';
import { submissions } from './schema';
import { contactFormSchema } from './validation';

type ActionResult = {
  success: boolean;
  errors?: Record<string, string>;
};

export async function submitContactForm(formData: {
  name: string;
  phone: string;
  specialization: string;
  description: string;
  honeypot: string;
  loadTime: number;
}): Promise<ActionResult> {
  // Spam check 1: honeypot field must be empty
  if (formData.honeypot) {
    return { success: true }; // Silent success for bots
  }

  // Spam check 2: submission must take at least 2 seconds
  if (Date.now() - formData.loadTime < 2000) {
    return { success: true }; // Silent success for bots
  }

  // Validate with Zod
  const result = contactFormSchema.safeParse({
    name: formData.name,
    phone: formData.phone,
    specialization: formData.specialization,
    description: formData.description,
  });

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string') {
        fieldErrors[field] = issue.message;
      }
    }
    return { success: false, errors: fieldErrors };
  }

  // Map specialization values to human-readable Russian labels for DB storage
  const specMap: Record<string, string> = {
    consultation: 'Онлайн-консультация',
    treatment: 'Лечение за рубежом',
    checkup: 'Чек-ап',
    'not-sure': 'Пока не определился',
  };

  try {
    await db.insert(submissions).values({
      name: result.data.name.trim(),
      phone: result.data.phone,
      specialization: specMap[result.data.specialization] ?? result.data.specialization,
      description: result.data.description?.trim() || null,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to insert submission:', error);
    return {
      success: false,
      errors: { _form: 'Произошла ошибка. Пожалуйста, попробуйте позже.' },
    };
  }
}

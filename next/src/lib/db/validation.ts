import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Введите ваше имя'),
  phone: z
    .string()
    .regex(
      /^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/,
      'Введите корректный номер телефона'
    ),
  specialization: z
    .string()
    .min(1, 'Выберите направление'),
  description: z
    .string()
    .optional()
    .default(''),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

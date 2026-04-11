import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { PHONE_NUMBER, PHONE_DISPLAY, EMAIL } from '@/lib/navigation';

export function ContactMethodGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {/* Phone */}
      <div className="liquid-card rounded-2xl p-5">
        <Phone className="w-5 h-5 text-mu-blue mb-3" />
        <p className="text-xs text-mu-text-500 font-semibold mb-1">Телефон</p>
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="text-sm text-mu-text-900 font-bold no-underline hover:text-mu-blue transition-colors"
        >
          {PHONE_DISPLAY}
        </a>
      </div>

      {/* Email */}
      <div className="liquid-card rounded-2xl p-5">
        <Mail className="w-5 h-5 text-mu-blue mb-3" />
        <p className="text-xs text-mu-text-500 font-semibold mb-1">Email</p>
        <a
          href={`mailto:${EMAIL}`}
          className="text-sm text-mu-text-900 font-bold no-underline hover:text-mu-blue transition-colors"
        >
          {EMAIL}
        </a>
      </div>

      {/* Office */}
      <div className="liquid-card rounded-2xl p-5">
        <MapPin className="w-5 h-5 text-mu-blue mb-3" />
        <p className="text-xs text-mu-text-500 font-semibold mb-1">Офис</p>
        <p className="text-sm text-mu-text-900 font-bold">Астана, Казахстан</p>
      </div>

      {/* Schedule */}
      <div className="liquid-card rounded-2xl p-5">
        <Clock className="w-5 h-5 text-mu-blue mb-3" />
        <p className="text-xs text-mu-text-500 font-semibold mb-1">График</p>
        <p className="text-sm text-mu-text-900 font-bold">Пн{'\u2013'}Пт 9:00{'\u2013'}18:00</p>
      </div>
    </div>
  );
}

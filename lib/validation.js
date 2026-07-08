import { z } from "zod";

// Téléphone tunisien : soit 8 chiffres locaux (ex: 20 123 456),
// soit format international +216 XX XXX XXX. On accepte espaces, points, tirets.
export function normalizePhone(raw) {
  return raw.replace(/[\s().-]/g, "");
}

export function isValidTunisianPhone(raw) {
  const v = normalizePhone(raw);
  // +216 suivi de 8 chiffres, ou 00216 + 8 chiffres, ou 8 chiffres locaux.
  return /^(\+216|00216)?\d{8}$/.test(v);
}

const phoneSchema = z
  .string()
  .trim()
  .refine(isValidTunisianPhone, "Numéro tunisien invalide (ex : 20 123 456 ou +216 20 123 456)");

export const orderSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(60),
  lastName: z.string().trim().min(1, "Le nom est requis").max(60),
  phone: phoneSchema,
  gouvernorat: z.string().trim().min(1, "Le gouvernorat est requis").max(60),
  city: z.string().trim().min(1, "La ville est requise").max(80),
  address: z.string().trim().min(5, "Adresse trop courte").max(300),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  items: z
    .array(
      z.object({
        juiceId: z.string().min(1),
        formatId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, "Le panier est vide"),
});

import { z } from 'zod'

export const hostnameRegex =
  /^(?!www\.)(?!.*:\/\/)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i

export const domainSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => hostnameRegex.test(v), {
    message: 'Invalid domain',
  })

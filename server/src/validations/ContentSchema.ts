import {z} from 'zod';

const contentSchema = z.object({
    link: z.string().url()
})
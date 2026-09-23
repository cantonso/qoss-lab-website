import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
const pages = defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/pages' }) });
const projects = defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/projects' }) });
export const collections = { pages, projects };

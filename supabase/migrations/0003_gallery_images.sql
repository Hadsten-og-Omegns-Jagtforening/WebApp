-- Add gallery_images JSONB column to news table
-- Stores additional images beyond the primary cover image_url
-- Shape: [{url: string, alt: string}]
ALTER TABLE public.news ADD COLUMN gallery_images jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.news.gallery_images IS 'Additional gallery images: [{url: string, alt: string}]';

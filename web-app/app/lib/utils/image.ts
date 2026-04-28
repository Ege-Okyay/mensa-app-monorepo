const SUPABASE_URL = "https://xoarqcxbowmkqvzchhde.supabase.co";

export function getOptimizedImageUrl(slug: string, width: number) {
  const path = `storage/v1/render/image/public/mensas/${slug}.webp`;
  const params = new URLSearchParams({
    width: width.toString(),
    quality: "50",
    format: "webp"
  });

  return `${SUPABASE_URL}/${path}?${params.toString()}`;
}

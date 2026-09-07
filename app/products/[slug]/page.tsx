import { redirect } from "next/navigation";

interface ProductDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  redirect(`/vehicles/${slug}`);
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALGORITHMS, getAlgorithmById } from "@/lib/algorithms";
import { VisualizerClient } from "./VisualizerClient";

interface PageProps {
  params: Promise<{ algorithm: string }>;
}

export async function generateStaticParams() {
  return ALGORITHMS.map((alg) => ({
    algorithm: alg.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { algorithm: algorithmId } = await params;
  const alg = getAlgorithmById(algorithmId);
  if (!alg) {
    return {
      title: "Thuật toán không tồn tại - DSA Visualizer",
    };
  }

  return {
    title: `${alg.name} Visualizer - Trực quan hóa giải thuật | DSA Visualizer`,
    description: alg.shortDescription,
    openGraph: {
      title: `${alg.name} - Trực quan hóa giải thuật tương tác`,
      description: alg.shortDescription,
      type: "website",
    },
  };
}

export default async function VisualizerPage({ params }: PageProps) {
  const { algorithm: algorithmId } = await params;
  const alg = getAlgorithmById(algorithmId);

  if (!alg) {
    notFound();
  }

  return <VisualizerClient algorithmId={algorithmId} />;
}

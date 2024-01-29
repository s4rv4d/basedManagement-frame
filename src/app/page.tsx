import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "BMFrame",
    description: "Based Management Gallery",
    openGraph: {
      title: "Based Management Gallery",
      images: ["https://i.postimg.cc/Hnv39tmR/based-management.png"],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": "https://i.postimg.cc/Hnv39tmR/based-management.png",
      "fc:frame:button:1": "View Gallery",
      "fc:frame:post_url": `${process.env.HOST}/api/changeImage?param1`,
    },
    metadataBase: new URL(process.env.HOST ?? ""),
  };
}

export default function Home() {
  return <main></main>;
}

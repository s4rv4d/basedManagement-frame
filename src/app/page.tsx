import { Metadata } from "next";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
      "fc:frame:button:1": "View Submissions",
      "fc:frame:post_url": `${process.env.HOST}/api/${getRandomNumber(
        1,
        1000000
      )}/changeImage?param1=start`,
    },
    metadataBase: new URL(process.env.HOST ?? ""),
  };
}

export default function Home() {
  return <main></main>;
}

"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    const url = `https://uplink.wtf/basedmanagement/mintboard/post/${id}?referrer=0x5371d2E73edf765752121426b842063fbd84f713`;

    // Perform the redirect
    // window.location.href = youtubeUrl; // For a full page reload redirect
    // Or use Next.js router for client-side redirect (comment out the line above if using this)
    router.push(url);
  }, [router]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}

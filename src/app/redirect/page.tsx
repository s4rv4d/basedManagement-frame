"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = String(searchParams?.get("id"));

  useEffect(() => {
    const url = `https://uplink.wtf/basedmanagement/mintboard/post/${id}?referrer=0x5371d2E73edf765752121426b842063fbd84f713`;
    router.push(url);
  }, [router, id]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main admin with blog tab
    router.replace("/admin");
  }, [router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff"
    }}>
      <p>Перенаправление...</p>
    </div>
  );
}

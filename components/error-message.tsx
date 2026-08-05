import React from "react";

export default function ErrorMessage({
  message,
}: {
  message: string | undefined;
}) {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 text-destructive font-medium tracking-tight">
      {message}
    </div>
  );
}

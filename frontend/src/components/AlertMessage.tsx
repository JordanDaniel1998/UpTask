import { PropsWithChildren } from "react";

export default function AlertMessage({ children }: PropsWithChildren) {
  return (
    <div className="text-center bg-red-100 text-red-600 font-bold p-3 uppercase text-sm">
      {children}
    </div>
  );
}

import { Suspense } from "react";
import Loading from "@/pages/misc/Loading";

export default function LazyComponent({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

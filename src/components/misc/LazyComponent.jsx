import { Suspense } from "react";
import Loading from "@/pages/misc/Loading";

/**
 * Wrapper component that renders a lazy-loaded component with a Suspense fallback.
 *
 * @param {Object} props - Component props
 * @param {React.ComponentType} props.component - The lazy-loaded component to render
 * @returns {React.ReactElement} The wrapped component with Suspense boundary
 * @example
 * const MyPage = lazy(() => import("@/pages/MyPage"));
 * <LazyComponent component={MyPage} someProp="value" />
 */
// eslint-disable-next-line no-unused-vars
export default function LazyComponent({ component: Component, ...props }) {
  return (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
}

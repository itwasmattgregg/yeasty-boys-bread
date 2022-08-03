import { useCallback } from "react";
import { useRouter } from "next/router";

export default function useRouterRefresh() {
  const router = useRouter();

  return useCallback(() => router.replace(router.asPath, _, {scroll: false}), [router.asPath]);
}

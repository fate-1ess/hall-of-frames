import Link from "next/link";
import { resolveAnchorHref } from "@/utils/base-path";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href={resolveAnchorHref("/")} prefetch={false}>
        Return Home
      </Link>
    </div>
  );
}

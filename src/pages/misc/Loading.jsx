import Throbber from "@/components/misc/Throbber";

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Throbber size="64px" />
    </div>
  );
}

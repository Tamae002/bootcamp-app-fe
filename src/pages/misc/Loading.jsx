import Throbber from "@/components/misc/Throbber";

export default function Loading() {
  return (
    <div className="w-screen h-svh flex justify-center items-center">
      <Throbber width="64px" height="64px" lineWidth="12px" />
    </div>
  );
}

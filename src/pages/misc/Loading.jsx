import Throbber from "@/components/misc/Throbber";

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Throbber size="64px" lineWidth="12px" />
    </div>
  );
}

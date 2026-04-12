import Warning from "@/assets/icons/Warning";
import Throbber from "@/components/misc/Throbber";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";

export default function DeleteConfirm({
  onDelete,
  onClose,
  isLoading = false,
}) {
  return (
    <DialogContent className="dialog-content space-y-4 text-center">
      <Warning className="mx-auto h-16 w-16" />
      <DialogTitle>Apakah anda yakin ingin menghapus data ini?</DialogTitle>
      <div className="flex flex-col gap-3 justify-center md:flex-row">
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="button button-danger"
        >
          {isLoading ? <Throbber /> : "Hapus"}
        </button>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="button button-primary"
        >
          Batalkan
        </button>
      </div>
    </DialogContent>
  );
}

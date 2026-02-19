import Throbber from "@/components/misc/Throbber";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { useState } from "react";

export default function GradeDialog({
  jawaban,
  onGrade,
  onClose,
  isLoading = false,
}) {
  const [nilai, setNilai] = useState(jawaban?.nilai || "");

  const handleSubmit = () => {
    const gradeValue = parseFloat(nilai);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      return;
    }
    onGrade({ ...jawaban, nilai: gradeValue });
  };

  return (
    <DialogContent className="dialog-content space-y-6">
      <div className="space-y-2">
        <DialogTitle className="text-xl font-semibold">Nilai Tugas</DialogTitle>
        <DialogDescription className="text-foreground/60 text-sm">
          Masukkan nilai untuk tugas yang telah dikumpulkan.
        </DialogDescription>
      </div>

      <div className="space-y-2">
        <label htmlFor="nilai" className="text-sm font-medium">
          Nilai (0-100)
        </label>
        <input
          id="nilai"
          type="number"
          min="0"
          max="100"
          value={nilai}
          onChange={(e) => setNilai(e.target.value)}
          placeholder="Masukkan nilai"
          disabled={isLoading}
          className="input w-full"
          autoFocus
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="button button-secondary"
        >
          Batalkan
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || nilai === ""}
          className="button button-primary"
        >
          {isLoading ? <Throbber /> : "Simpan Nilai"}
        </button>
      </div>
    </DialogContent>
  );
}

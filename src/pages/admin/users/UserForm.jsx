import Person from "@/assets/icons/Person";
import userSchema from "@/schemas/user";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

export default function UserForm({
  initial = userSchema,
  onSubmit,
  onClose,
  isEdit,
}) {
  const [form, setForm] = useState(initial || userSchema);

  return (
    <DialogContent className="dialog-content space-y-3 dark:text-white">
      <DialogTitle className="text-center font-bold">
        {isEdit ? "Edit Peserta" : "Tambah Peserta"}
      </DialogTitle>

      <div className="mx-auto flex size-24 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        {form?.gambar ? (
          <img src={form.gambar} className="size-16 rounded-full" />
        ) : (
          <Person className="size-16" />
        )}
      </div>

      {[
        { label: "Nama", key: "name" },
        { label: "Email", key: "email" },
      ].map((item, i) => (
        <div key={i}>
          <label className="text-xs dark:text-gray-300">{item.label}</label>
          <input
            className="input mt-1"
            value={form[item.key]}
            onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
          />
        </div>
      ))}

      {!isEdit && (
        <div>
          <label className="text-xs dark:text-gray-300">Password</label>
          <input
            type="password"
            className="input mt-1"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder=""
          />
        </div>
      )}

      {!isEdit && (
        <div>
          <label className="text-xs dark:text-gray-300">Role</label>
          <select
            className="input mt-1"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            disabled={isEdit}
          >
            <option value="admin">Admin</option>
            <option value="mentor">Mentor</option>
            <option value="user">User</option>
          </select>
        </div>
      )}

      <button
        onClick={() => onSubmit(form)}
        className="button button-primary w-full"
      >
        {isEdit ? "Perbarui" : "Buat"}
      </button>

      <button onClick={onClose} className="button button-danger w-full">
        Batalkan
      </button>
    </DialogContent>
  );
}

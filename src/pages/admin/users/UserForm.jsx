import Person from "@/assets/icons/Person";
import Input from "@/components/input/Input";
import PasswordInput from "@/components/input/PasswordInput";
import Select from "@/components/input/Select";
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

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "mentor", label: "Mentor" },
    { value: "user", label: "Siswa" },
  ];


  return (
    <DialogContent className="dialog-content flex flex-col gap-4 space-y-3 dark:text-white">
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
        <Input
          key={i}
          label={item.label}
          className="mt-1"
          value={form[item.key]}
          onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
        />
      ))}

      {!isEdit && (
        <PasswordInput
          label="Password"
          className="mt-1"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="new-password"
        />
      )}

      {!isEdit && (
        <Select
          label="Role"
          className="mt-1"
          options={roleOptions}
          value={form.role}
          onChange={(value) => setForm({ ...form, role: value })}
          disabled={isEdit}
          placeholder="Pilih role..."
        />
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

import Person from "@/assets/icons/Person";
import Input from "@/components/input/Input";
import PasswordInput from "@/components/input/PasswordInput";
import SelectInput from "@/components/input/SelectInput";
import Throbber from "@/components/misc/Throbber";
import userSchema from "@/schemas/user";
import {
  createUserSchema,
  updateUserSchema,
} from "@/validations/user.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export default function UserForm({
  initial = userSchema,
  onSubmit,
  onClose,
  isEdit,
  error = null,
  isLoading = false,
}) {
  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "mentor", label: "Mentor" },
    { value: "user", label: "Siswa" },
  ];

  const validationSchema = isEdit ? updateUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initial,
  });

  useEffect(() => {
    reset(initial);
  }, [initial, reset]);

  const watchedValues = watch();
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <DialogContent
      className="dialog-content flex flex-col gap-4 space-y-3 dark:text-white"
    >
      <DialogTitle className="text-center font-bold">
        {isEdit ? "Edit Peserta" : "Tambah Peserta"}
      </DialogTitle>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4"
      >
        {error && (
          <div
            ref={errorRef}
            tabIndex={-1}
            className="rounded-xl bg-red-100 p-3 text-sm text-red-600
              dark:bg-red-900/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <div
          className="mx-auto flex size-24 items-center justify-center
            rounded-2xl bg-gray-100 dark:bg-gray-800"
        >
          {watchedValues?.gambar ? (
            <img src={watchedValues.gambar} className="size-16 rounded-full" />
          ) : (
            <Person className="size-16" />
          )}
        </div>

        <Input
          label="Nama"
          containerClassName="mt-1"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          containerClassName="mt-1"
          error={errors.email?.message}
          {...register("email")}
        />

        {!isEdit && (
          <PasswordInput
            label="Password"
            containerClassName="mt-1"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
        )}

        {!isEdit && (
          <SelectInput
            label="Role"
            containerClassName="mt-1"
            options={roleOptions}
            value={watchedValues.role}
            onChange={(value) => setValue("role", value)}
            disabled={isEdit}
            placeholder="Pilih role..."
            error={errors.role?.message}
          />
        )}

        <button
          type="submit"
          className="button button-primary w-full"
          disabled={isLoading}
        >
          {isLoading && <Throbber size="16px" />}
          {isEdit ? "Perbarui" : "Buat"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="button button-danger w-full"
        >
          Batalkan
        </button>
      </form>
    </DialogContent>
  );
}

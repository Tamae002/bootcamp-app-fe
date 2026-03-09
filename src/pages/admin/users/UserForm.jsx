import fileApi from "@/apis/file.api";
import Camera from "@/assets/icons/Camera";
import Delete from "@/assets/icons/Delete";
import Person from "@/assets/icons/Person";
import Input from "@/components/input/Input";
import PasswordInput from "@/components/input/PasswordInput";
import SelectInput from "@/components/input/SelectInput";
import Throbber from "@/components/misc/Throbber";
import { API_BASE_URL } from "@/constants";
import { useAuth } from "@/contexts/auth";
import userSchema from "@/schemas/user";
import {
  createUserSchema,
  updateUserSchema,
} from "@/validations/user.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function UserForm({
  initial = userSchema,
  onSubmit,
  onClose,
  isEdit,
  error = null,
  isLoading = false,
}) {
  const { user } = useAuth();

  const roleOptions = [
    ...(["superadmin", "admin"].includes(user.role) ? [{ value: "admin", label: "Admin" }] : []),
    { value: "mentor", label: "Mentor" },
    { value: "user", label: "Siswa" },
  ];

  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const updatePhotoPreview = useEffectEvent((photo) => {
    setPhotoPreviewUrl(photo);
  });
  const photoInput = useRef(null);

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
    updatePhotoPreview(initial?.gambar ? API_BASE_URL + initial.gambar : null);
  }, [initial, reset]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreviewUrl(null);
    if (photoInput.current) {
      photoInput.current.value = "";
    }
  };

  const watchedValues = watch();
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const handleFormSubmit = async (data) => {
    let uploadedImageUrl = "";

    const photoFile = photoInput.current?.files?.[0];
    if (photoFile) {
      const uploadResponse = await fileApi.uploadImage({
        files: photoFile,
        nama: `user-photo-${data.user_id || Date.now()}`,
      });
      uploadedImageUrl = uploadResponse.data.urls[0];
    }

    const payload = {
      ...data,
      gambar: uploadedImageUrl || data.gambar,
    };

    onSubmit(payload);
  };

  return (
    <DialogContent
      className="dialog-content flex flex-col gap-4 dark:text-white"
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

        <div className="flex flex-col items-center gap-3">
          <figure
            className="group relative flex size-28 items-center justify-center
              overflow-hidden rounded-full bg-gray-100 shadow-md
              dark:bg-gray-800"
          >
            {photoPreviewUrl ? (
              <img
                src={photoPreviewUrl}
                className="size-full object-cover"
                alt="Preview"
              />
            ) : (
              <Person className="size-14 text-gray-400 dark:text-gray-500" />
            )}
            <div
              className="absolute inset-0 flex items-center justify-center
                bg-black/40 opacity-0 transition-opacity duration-200
                group-hover:opacity-100"
            >
              <label
                htmlFor="photo"
                className="bg-primary flex cursor-pointer items-center gap-1.5
                  rounded-full px-3 py-1.5 text-xs font-medium text-white
                  shadow-lg transition-transform hover:scale-105
                  active:scale-95"
              >
                <Camera className="h-3.5 w-3.5" />
                Ubah
              </label>
            </div>
            <input
              ref={photoInput}
              type="file"
              name="gambar"
              id="photo"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </figure>
          {photoPreviewUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="flex items-center gap-1.5 text-xs text-red-500
                transition-colors hover:text-red-600"
            >
              <Delete className="h-3.5 w-3.5" />
              Hapus foto
            </button>
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
            // @ts-ignore
            error={errors.password?.message}
            // @ts-ignore
            {...register("password")}
          />
        )}

        {!isEdit && (
          <SelectInput
            label="Role"
            containerClassName="mt-1"
            options={roleOptions}
            // @ts-ignore
            value={watchedValues.role}
            // @ts-ignore
            onChange={(value) => setValue("role", value)}
            disabled={isEdit}
            placeholder="Pilih role..."
            // @ts-ignore
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

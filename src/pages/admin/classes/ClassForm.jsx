import classApi from "@/apis/class.api";
import fileApi from "@/apis/file.api";
import Delete from "@/assets/icons/Delete";
import UserSelect from "@/components/class/UserSelect";
import DateInput from "@/components/input/DateInput";
import Input from "@/components/input/Input";
import Textarea from "@/components/input/Textarea";
import Throbber from "@/components/misc/Throbber";
import { API_BASE_URL, DEFAULT_CLASS_IMAGE, ENV } from "@/constants";
import { useClass } from "@/contexts/class";
import { classSchema } from "@/validations/class.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
/** @import {ClassFormData} from "@/schemas/class" */

export default function ClassForm({ edit = false }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: classId } = useParams();
  const { class: class_ } = useClass();
  const [error, setError] = useState("");
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);
  const updateBannerPreview = useEffectEvent((banner) => {
    setBannerPreviewUrl(banner);
  });
  const bannerInput = useRef(null);

  const defaultMentorCount = useMemo(
    () => class_?.list_mentor?.length || 0,
    [class_],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(classSchema),
    context: { isEdit: edit, defaultMentorCount },
    defaultValues: {
      nama_kelas: "",
      deskripsi: "",
      tanggal_mulai: new Date(),
      tanggal_berakhir: null,
      mentor_added_users: [],
      mentor_removed_users: [],
      student_added_users: [],
      student_removed_users: [],
    },
  });

  useEffect(() => {
    if (edit && class_) {
      reset({
        nama_kelas: class_?.nama_kelas || "",
        deskripsi: class_?.deskripsi || "",
        tanggal_mulai: new Date(class_?.tanggal_mulai),
        tanggal_berakhir: new Date(class_?.tanggal_berakhir),
      });
      updateBannerPreview(
        class_?.gambar ? API_BASE_URL + class_?.gambar : null,
      );
    }
  }, [edit, class_, reset]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = () => {
    setBannerPreviewUrl(null);
    if (bannerInput.current) {
      bannerInput.current.value = "";
    }
  };

  const createMutation = useMutation({
    /** @param {ClassFormData} payload */
    mutationFn: (payload) => classApi.create(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      navigate(`/classes/${response.data.kelas.kelas_id}`);
    },
    onError: (err) => {
      if (ENV == "development") console.error(err);

      if (err instanceof AxiosError) {
        if (err.response?.status) setError(err.response.data?.message);
        else setError("Terjadi kesalahan pada server. Mohon coba lagi nanti.");
      } else {
        setError("Terjadi kesalahan yang tidak terduga.");
      }
    },
  });

  const updateMutation = useMutation({
    /** @param {ClassFormData} payload */
    mutationFn: (payload) => classApi.update(classId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
      navigate(`/classes/${classId}`);
    },
    onError: (err) => {
      if (ENV == "development") console.error(err);

      if (err instanceof AxiosError) {
        if (err.response?.status) setError(err.response.data?.message);
        else setError("Terjadi kesalahan pada server. Mohon coba lagi nanti.");
      } else {
        setError("Terjadi kesalahan yang tidak terduga.");
      }
    },
  });

  const onSubmit = async (data) => {
    setError("");

    let uploadedImageUrl = "";

    const bannerFile = bannerInput.current?.files?.[0];
    if (bannerFile) {
      const uploadResponse = await fileApi.upload({
        files: bannerFile,
        nama: `class-banner-${classId}`,
      });
      uploadedImageUrl = uploadResponse.data.urls[0];
    }

    /** @type {ClassFormData} */
    const payload = {
      nama_kelas: data.nama_kelas,
      deskripsi: data.deskripsi,
      gambar: uploadedImageUrl,
      tanggal_mulai: data.tanggal_mulai
        ? data.tanggal_mulai.toISOString()
        : null,
      tanggal_berakhir: data.tanggal_berakhir
        ? data.tanggal_berakhir.toISOString()
        : null,
      added_users: [...data.mentor_added_users, ...data.student_added_users],
      removed_users: [
        ...data.mentor_removed_users,
        ...data.student_removed_users,
      ],
    };

    if (edit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="content-wrapper">
      <title>{`${edit ? "Edit" : "Buat"} Kelas | Geeksfarm`}</title>
      <header className="mb-8">
        <h1 className="h-rule text-5xl">{edit ? "Edit" : "Buat"} Kelas</h1>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <figure className="group relative">
          <img
            id="banner-preview"
            src={bannerPreviewUrl || DEFAULT_CLASS_IMAGE}
            className="aspect-7/3 w-full rounded-md object-cover
              group-hover:opacity-70"
            onError={(e) => {
              if (e.target instanceof HTMLImageElement)
                e.target.src = DEFAULT_CLASS_IMAGE;
            }}
          />

          <div
            className="absolute top-1/2 left-1/2 hidden -translate-1/2 flex-row
              gap-2 group-hover:flex"
          >
            <label
              htmlFor="banner"
              className="button button-primary font-bold shadow-2xl"
            >
              Upload Gambar
            </label>
            {bannerPreviewUrl && (
              <button
                type="button"
                onClick={handleRemoveBanner}
                className="button button-danger font-bold shadow-2xl"
              >
                <Delete className="h-5 w-5" />
                Hapus
              </button>
            )}
          </div>
          <input
            ref={bannerInput}
            type="file"
            name="gambar"
            id="banner"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />
        </figure>

        {error && <p className="text-red text-sm">{error}</p>}

        <Input
          type="text"
          id="title"
          label="Judul"
          error={errors.nama_kelas?.message}
          {...register("nama_kelas")}
        />

        <Textarea
          id="description"
          className="h-26 resize-none"
          label="Deskripsi"
          error={errors.deskripsi?.message}
          {...register("deskripsi")}
        />

        <div className="flex gap-4 *:flex-1">
          <Controller
            name="tanggal_mulai"
            control={control}
            render={({ field }) => (
              <DateInput
                label="Tanggal Mulai"
                selectsStart
                startDate={field.value}
                endDate={control._formValues.tanggal_berakhir}
                maxDate={control._formValues.tanggal_berakhir}
                selected={field.value}
                onChange={field.onChange}
                error={errors.tanggal_mulai?.message}
              />
            )}
          />
          <Controller
            name="tanggal_berakhir"
            control={control}
            render={({ field }) => (
              <DateInput
                label="Tanggal Berakhir"
                selectsEnd
                startDate={control._formValues.tanggal_mulai}
                endDate={field.value}
                minDate={control._formValues.tanggal_mulai}
                selected={field.value}
                onChange={field.onChange}
                error={errors.tanggal_berakhir?.message}
              />
            )}
          />
        </div>

        <div>
          <p>Mentor</p>
          <Controller
            name="mentor_added_users"
            control={control}
            render={({ field: addedField }) => (
              <Controller
                name="mentor_removed_users"
                control={control}
                render={({ field: removedField }) => (
                  <UserSelect
                    role="mentor"
                    defaultUsers={class_?.list_mentor || []}
                    addedUsers={addedField.value}
                    removedUsers={removedField.value}
                    onAddedUsersChange={addedField.onChange}
                    onRemovedUsersChange={removedField.onChange}
                    error={
                      errors.mentor_added_users?.message ||
                      errors.mentor_removed_users?.message
                    }
                  />
                )}
              />
            )}
          />
        </div>

        <div>
          <p>Peserta</p>
          <Controller
            name="student_added_users"
            control={control}
            render={({ field: addedField }) => (
              <Controller
                name="student_removed_users"
                control={control}
                render={({ field: removedField }) => (
                  <UserSelect
                    role="user"
                    defaultUsers={class_?.list_peserta || []}
                    addedUsers={addedField.value}
                    removedUsers={removedField.value}
                    onAddedUsersChange={addedField.onChange}
                    onRemovedUsersChange={removedField.onChange}
                  />
                )}
              />
            )}
          />
        </div>

        <button className="button button-primary font-bold">
          {(createMutation.isPending || updateMutation.isPending) && (
            <Throbber />
          )}{" "}
          {edit ? "Simpan" : "Buat Kelas"}
        </button>
      </form>
    </div>
  );
}

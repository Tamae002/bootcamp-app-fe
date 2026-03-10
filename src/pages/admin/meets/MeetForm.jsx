import meetApi from "@/apis/meet.api";
import DateInput from "@/components/input/DateInput";
import Input from "@/components/input/Input";
import MarkdownEditor from "@/components/meet/MarkdownEditor";
import Throbber from "@/components/misc/Throbber";
import { ENV } from "@/constants";
import { useClass } from "@/contexts/class";
import { useTheme } from "@/contexts/theme";
import { meetSchema } from "@/validations/meet.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
/** @import {MeetFormData} from "@/schemas/meet" */

export default function MeetForm({ edit = false }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  const { id: classId, meetId } = useParams();
  const { class: class_ } = useClass();
  const meet = useMemo(
    () => class_?.pertemuan.find((meet) => meet.pertemuan_id == meetId),
    [meetId, class_]
  );
  const [error, setError] = useState("");
  const descriptionInput = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(meetSchema),
    defaultValues: {
      judul: "",
      tanggal: null,
      link_lampiran: "",
    },
  });

  useEffect(() => {
    if (edit && meet) {
      reset({
        judul: meet.judul || "",
        tanggal: meet.tanggal ? new Date(meet.tanggal) : null,
        link_lampiran: meet.link_lampiran || "",
      });
      descriptionInput.current?.setMarkdown(meet.deskripsi_tugas || "");
    }
  }, [edit, meet, reset]);

  const createMutation = useMutation({
    /** @param {MeetFormData} payload */
    mutationFn: (payload) => meetApi.create(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
      navigate(`/admin/classes/${classId}/meet/${response.data.pertemuan_id}`);
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
    /** @param {MeetFormData} payload */
    mutationFn: (payload) => meetApi.update(meetId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
      navigate(`/admin/classes/${classId}/meet/${meetId}`);
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

  const onSubmit = (data) => {
    setError("");

    /** @type {MeetFormData} */
    const payload = {
      kelas_id: classId,
      judul: data.judul,
      tanggal: data.tanggal ? data.tanggal.toISOString() : null,
      deskripsi_tugas: descriptionInput.current?.getMarkdown() || "",
      link_lampiran: data.link_lampiran || null,
    };

    if (edit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="m-auto max-w-4xl p-8">
      <title>{`${edit ? "Edit" : "Buat"} Pertemuan | Geeksfarm`}</title>
      <header className="mb-8">
        <h1 className="h-rule text-5xl">{edit ? "Edit" : "Buat"} Pertemuan</h1>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {error && <p className="text-red text-sm">{error}</p>}
        <div className="flex items-end gap-4">
          <Input
            type="text"
            id="title"
            label="Judul"
            error={errors.judul?.message}
            containerClassName="flex-1"
            {...register("judul")}
          />

          <Controller
            name="tanggal"
            control={control}
            render={({ field }) => (
              <DateInput
                label="Tanggal & Waktu"
                selected={field.value}
                onChange={field.onChange}
                minDate={new Date()}
                timeInputLabel="Waktu"
                showTimeInput
                error={errors.tanggal?.message}
              />
            )}
          />
        </div>

        <MarkdownEditor
          ref={descriptionInput}
          markdown=""
          placeholder="Deskripsi"
          className={theme == "dark" ? "dark dark-theme" : ""}
          contentEditableClassName="prose prose-sm dark:prose-invert max-w-full"
          isDark={theme == "dark"}
        />

        <Input
          type="url"
          id="attachment-link"
          label="Link Lampiran"
          error={errors.link_lampiran?.message}
          {...register("link_lampiran")}
        />

        <button className="button button-primary">
          {(createMutation.isPending || updateMutation.isPending) && <Throbber />}{" "}
          {edit ? "Simpan" : "Buat Pertemuan"}
        </button>
      </form>
    </div>
  );
}

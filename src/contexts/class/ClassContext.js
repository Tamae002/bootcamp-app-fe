import { createContext } from "react";
/** @import React from "react" */
/** @import { Class } from "@/schemas/class" */

/**
 * @typedef ClassContextValue
 * @prop {Class} class
 * @prop {boolean} isLoading
 * @prop {boolean} isError
 * @prop {Error} error
 */

/** @type {React.Context<ClassContextValue>} */
export const ClassContext = createContext({
  class: {
    kelas_id: null,
    nama_kelas: "",
    deskripsi: "",
    gambar: "",
    list_mentor: [],
    list_peserta: [],
    pertemuan: [],
    tanggal_berakhir: "",
    tanggal_mulai: ""
  }
});

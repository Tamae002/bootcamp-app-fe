/**
 * Mengonversi objek FormData menjadi objek JSON.
 *
 * @param {FormData} formData - Objek FormData yang akan dikonversi.
 * @returns {object} Objek JSON yang merepresentasikan data dari FormData.
 */
export default function formDataToJson(formData) {
  let result = {};
  for (let [key, value] of formData.entries())
    result[key] = value;
  return result;
}

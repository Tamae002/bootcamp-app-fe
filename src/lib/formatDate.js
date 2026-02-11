/**
 * Mengonversi tanggal menjadi format Indonesia.
 * Format: "5 Januari 2025, 17:00"
 *
 * @param {string|Date|number} date - Tanggal yang akan diformat.
 * @param {object} options - Opsi format.
 * @param {boolean} options.showTime - Tampilkan waktu (default: true).
 * @returns {string} Tanggal dalam format Indonesia.
 */
export default function formatDate(date, options = { showTime: true }) {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "-";
  }

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  const datePart = `${day} ${month} ${year}`;
  const timePart = `${hours}:${minutes}`;

  return options.showTime ? `${datePart}, ${timePart}` : datePart;
}

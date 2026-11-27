import "./style.css";
import { appConfig } from "./config";
import type { Tugas } from "./types";
import {
  ambilSemuaTugas,
  tambahTugas,
  editTugas,
  hapusTugas,
  ubahStatus,
} from "./tugas-service";

// Generics lagi: T adalah tipe elemen HTML yang kita harapkan
function ambilElemen<T extends HTMLElement>(id: string): T {
  const elemen: HTMLElement | null = document.getElementById(id);
  if (elemen === null) {
    throw new Error(`Elemen #${id} tidak ditemukan`);
  }
  return elemen as T;
}

const judulApp = ambilElemen<HTMLHeadingElement>("app-title");
const infoApp = ambilElemen<HTMLParagraphElement>("app-info");
const form = ambilElemen<HTMLFormElement>("form-tugas");
const judulForm = ambilElemen<HTMLHeadingElement>("form-title");
const inputJudul = ambilElemen<HTMLInputElement>("input-judul");
const inputMatkul = ambilElemen<HTMLInputElement>("input-matkul");
const inputDeadline = ambilElemen<HTMLInputElement>("input-deadline");
const tombolSimpan = ambilElemen<HTMLButtonElement>("btn-simpan");
const tombolBatal = ambilElemen<HTMLButtonElement>("btn-batal");
const ringkasan = ambilElemen<HTMLParagraphElement>("ringkasan");
const daftar = ambilElemen<HTMLUListElement>("daftar-tugas");

// Union type: null berarti sedang menambah, number berarti sedang mengedit tugas dengan id itu
let idSedangDiedit: number | null = null;

// Nilai dari environment variables (.env)
judulApp.textContent = appConfig.name;
infoApp.textContent = `Versi ${appConfig.version} • oleh ${appConfig.author}`;

function formatTanggal(tanggal: string): string {
  const d: Date = new Date(`${tanggal}T00:00:00`);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buatTombol(
  teks: string,
  kelas: string,
  aksi: () => void
): HTMLButtonElement {
  const tombol: HTMLButtonElement = document.createElement("button");
  tombol.type = "button";
  tombol.className = `btn ${kelas}`;
  tombol.textContent = teks;
  tombol.addEventListener("click", aksi);
  return tombol;
}

function buatItem(tugas: Tugas): HTMLLIElement {
  const selesai: boolean = tugas.status === "Selesai";

  const item: HTMLLIElement = document.createElement("li");
  item.className = selesai ? "item selesai" : "item";

  const info: HTMLDivElement = document.createElement("div");
  info.className = "item-info";

  const judul: HTMLElement = document.createElement("strong");
  judul.textContent = tugas.judul;

  const detail: HTMLSpanElement = document.createElement("span");
  detail.className = "detail";
  detail.textContent = `${tugas.mataKuliah} • Deadline: ${formatTanggal(tugas.deadline)}`;

  const status: HTMLSpanElement = document.createElement("span");
  status.className = selesai ? "badge badge-selesai" : "badge badge-belum";
  status.textContent = tugas.status;

  info.append(judul, detail, status);

  const aksi: HTMLDivElement = document.createElement("div");
  aksi.className = "item-aksi";
  aksi.append(
    buatTombol(selesai ? "Tandai Belum" : "Tandai Selesai", "btn-secondary", () => {
      ubahStatus(tugas.id);
      render();
    }),
    buatTombol("Edit", "btn-secondary", () => mulaiEdit(tugas)),
    buatTombol("Hapus", "btn-danger", () => {
      if (confirm(`Hapus tugas "${tugas.judul}"?`)) {
        hapusTugas(tugas.id);
        if (idSedangDiedit === tugas.id) {
          resetForm();
        }
        render();
      }
    })
  );

  item.append(info, aksi);
  return item;
}

function render(): void {
  const semua: Tugas[] = ambilSemuaTugas();
  const jumlahSelesai: number = semua.filter((t) => t.status === "Selesai").length;
  ringkasan.textContent = `${semua.length} tugas • ${jumlahSelesai} selesai • ${semua.length - jumlahSelesai} belum selesai`;

  daftar.replaceChildren();

  if (semua.length === 0) {
    const kosong: HTMLLIElement = document.createElement("li");
    kosong.className = "kosong";
    kosong.textContent = "Belum ada tugas. Tambahkan tugas pertamamu!";
    daftar.append(kosong);
    return;
  }

  semua.forEach((tugas) => daftar.append(buatItem(tugas)));
}

function resetForm(): void {
  idSedangDiedit = null;
  form.reset();
  judulForm.textContent = "Tambah Tugas";
  tombolSimpan.textContent = "Tambah";
  tombolBatal.hidden = true;
}

function mulaiEdit(tugas: Tugas): void {
  idSedangDiedit = tugas.id;
  inputJudul.value = tugas.judul;
  inputMatkul.value = tugas.mataKuliah;
  inputDeadline.value = tugas.deadline;
  judulForm.textContent = "Edit Tugas";
  tombolSimpan.textContent = "Simpan Perubahan";
  tombolBatal.hidden = false;
  inputJudul.focus();
  form.scrollIntoView({ behavior: "smooth" });
}

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  const judul: string = inputJudul.value.trim();
  const mataKuliah: string = inputMatkul.value.trim();
  const deadline: string = inputDeadline.value;

  if (judul === "" || mataKuliah === "" || deadline === "") {
    return;
  }

  if (idSedangDiedit === null) {
    tambahTugas(judul, mataKuliah, deadline);
  } else {
    editTugas(idSedangDiedit, { judul, mataKuliah, deadline });
  }

  resetForm();
  render();
});

tombolBatal.addEventListener("click", resetForm);

render();
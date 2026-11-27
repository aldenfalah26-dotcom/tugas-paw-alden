import type { Tugas, StatusTugas } from "./types";
import { ambilData, simpanData } from "./storage";
import { cariBerdasarkanId, hapusBerdasarkanId } from "./utils";

const KUNCI_STORAGE: string = "daftar-tugas-kuliah";

// Array bertipe Tugas[]
let daftarTugas: Tugas[] = ambilData<Tugas[]>(KUNCI_STORAGE, []);

function simpan(): void {
  simpanData<Tugas[]>(KUNCI_STORAGE, daftarTugas);
}

export function ambilSemuaTugas(): Tugas[] {
  return [...daftarTugas];
}

export function tambahTugas(
  judul: string,
  mataKuliah: string,
  deadline: string
): Tugas {
  const idBaru: number =
    daftarTugas.length > 0 ? Math.max(...daftarTugas.map((t) => t.id)) + 1 : 1;
  const tugasBaru: Tugas = {
    id: idBaru,
    judul,
    mataKuliah,
    deadline,
    status: "Belum Selesai",
  };
  daftarTugas.push(tugasBaru);
  simpan();
  return tugasBaru;
}

export function editTugas(
  id: number,
  dataBaru: Partial<Omit<Tugas, "id">>
): boolean {
  const tugas: Tugas | undefined = cariBerdasarkanId(daftarTugas, id);
  if (tugas === undefined) {
    return false;
  }
  Object.assign(tugas, dataBaru);
  simpan();
  return true;
}

export function hapusTugas(id: number): void {
  daftarTugas = hapusBerdasarkanId(daftarTugas, id);
  simpan();
}

export function ubahStatus(id: number): void {
  const tugas: Tugas | undefined = cariBerdasarkanId(daftarTugas, id);
  if (tugas === undefined) {
    return;
  }
  const statusBaru: StatusTugas =
    tugas.status === "Selesai" ? "Belum Selesai" : "Selesai";
  tugas.status = statusBaru;
  simpan();
}
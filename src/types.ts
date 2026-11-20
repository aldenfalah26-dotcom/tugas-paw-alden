export type StatusTugas = "Belum Selesai" | "Selesai";

export interface Tugas {
  id: number;
  judul: string;
  mataKuliah: string;
  deadline: string;
  status: StatusTugas;
}
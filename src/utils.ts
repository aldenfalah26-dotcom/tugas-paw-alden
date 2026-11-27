// Generics: <T> artinya fungsi ini bisa dipakai untuk tipe data apa pun
// yang punya properti id bertipe number (misalnya Tugas).
export function cariBerdasarkanId<T extends { id: number }>(
  daftar: T[],
  id: number
): T | undefined {
  return daftar.find((item) => item.id === id);
}

export function hapusBerdasarkanId<T extends { id: number }>(
  daftar: T[],
  id: number
): T[] {
  return daftar.filter((item) => item.id !== id);
}
export function simpanData<T>(kunci: string, data: T): void {
  localStorage.setItem(kunci, JSON.stringify(data));
}

export function ambilData<T>(kunci: string, nilaiAwal: T): T {
  const mentah: string | null = localStorage.getItem(kunci);
  if (mentah === null) {
    return nilaiAwal;
  }
  try {
    return JSON.parse(mentah) as T;
  } catch {
    return nilaiAwal;
  }
}
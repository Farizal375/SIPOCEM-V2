"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import ExcelJS from "exceljs";

export async function exportRekapDataAction(bulan: string, tahun: string) {
  const supabase = await createSupabaseServerClient();

  // Ambil data pemeriksaan sesuai filter bulan/tahun
  const { data: listPemeriksaan, error } = await supabase
    .from("pemeriksaan_anak")
    .select(`
      tanggal_periksa, bb, tb, lk, 
      anak (nama_lengkap, nik, nama_ibu, jenis_kelamin)
    `)
    .gte('tanggal_periksa', `${tahun}-${bulan}-01`)
    .lte('tanggal_periksa', `${tahun}-${bulan}-31`);

  if (error) return { error: error.message };

  // Buat Workbook Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Rekap Data Anak");

  // Header Style
  worksheet.columns = [
    { header: "Tanggal", key: "tgl", width: 15 },
    { header: "Nama Anak", key: "nama", width: 30 },
    { header: "JK", key: "jk", width: 10 },
    { header: "Nama Ibu", key: "ibu", width: 30 },
    { header: "BB (kg)", key: "bb", width: 10 },
    { header: "TB (cm)", key: "tb", width: 10 },
    { header: "LK (cm)", key: "lk", width: 10 },
  ];

  // Isi Data
  listPemeriksaan.forEach((item: any) => {
    worksheet.addRow({
      tgl: item.tanggal_periksa,
      nama: item.anak?.nama_lengkap,
      jk: item.anak?.jenis_kelamin,
      ibu: item.anak?.nama_ibu,
      bb: item.bb,
      tb: item.tb,
      lk: item.lk
    });
  });

  // Konversi ke Base64 agar bisa dikirim ke Client Component
  const buffer = await workbook.xlsx.writeBuffer();
  return { 
    success: true, 
    data: Buffer.from(buffer).toString("base64"),
    filename: `Rekap_Posyandu_${bulan}_${tahun}.xlsx`
  };
}
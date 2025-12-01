"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// PERBAIKAN 1: Import SubmitHandler
import { useForm, SubmitHandler } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, User, Mail, Lock, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- SKEMA VALIDASI (ZOD) ---
const registerSchema = z.object({
  // STEP 1: Akun & Dasar
  nama_lengkap: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  no_telepon: z.string().min(10, "Nomor telepon tidak valid"),
  alamat: z.string().min(1, "Alamat wajib diisi"),

  // STEP 2: Identitas Ibu (User)
  nik_ibu: z.string().min(16, "NIK harus 16 digit"),
  jenis_kelamin_ibu: z.string().min(1, "Pilih jenis kelamin"),
  no_jkn_ibu: z.string().optional(),
  faskes_ibu: z.string().optional(),
  pendidikan_ibu: z.string().optional(),
  pekerjaan_ibu: z.string().optional(),
  gol_darah_ibu: z.string().optional(),
  tempat_lahir_ibu: z.string().min(1, "Tempat lahir wajib diisi"),
  tanggal_lahir_ibu: z.string().min(1, "Tanggal lahir wajib diisi"),
  asuransi_ibu: z.string().optional(),
  // PERBAIKAN 2: Pastikan tipe data konsisten (string)
  jumlah_anak: z.string().default("0"), 

  // STEP 3: Identitas Suami
  nama_suami: z.string().min(1, "Nama suami wajib diisi"),
  nik_suami: z.string().min(16, "NIK harus 16 digit"),
  jenis_kelamin_suami: z.string().default("Laki-laki"),
  alamat_suami: z.string().optional(),
  no_jkn_suami: z.string().optional(),
  faskes_suami: z.string().optional(),
  pendidikan_suami: z.string().optional(),
  pekerjaan_suami: z.string().optional(),
  gol_darah_suami: z.string().optional(),
  tempat_lahir_suami: z.string().optional(),
  tanggal_lahir_suami: z.string().optional(),
  asuransi_suami: z.string().optional(),
  no_telepon_suami: z.string().optional(),

  // STEP 4: Identitas Anak (DYNAMIC ARRAY)
  data_anak: z.array(z.object({
    nama: z.string().optional(),
    nik: z.string().optional(),
    jenis_kelamin: z.string().optional(),
    anak_ke: z.string().optional(),
    jkn: z.string().optional(),
    tempat_lahir: z.string().optional(),
    tanggal_lahir: z.string().optional(),
  })).optional(),

  // STEP 5: Data Kehamilan
  hpht: z.string().optional(),
  taksiran_persalinan: z.string().optional(),

  // STEP 6: Riwayat & Persetujuan
  kehamilan_ke: z.string().optional(),
  riwayat_keguguran: z.string().optional(),
  riwayat_penyakit: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, "Anda harus menyetujui S&K"),
});

type FormData = z.infer<typeof registerSchema>;

export function MultiStepRegister() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hook Form
  // PERBAIKAN 3: Hapus generic <FormData> di useForm untuk membiarkan TypeScript meng-infer sendiri dari resolver
  // Ini trik paling ampuh untuk menghilangkan error "Type incompatible"
  const { register, handleSubmit, trigger, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
        alamat_suami: "",
        jenis_kelamin_ibu: "Perempuan",
        jenis_kelamin_suami: "Laki-laki",
        jumlah_anak: "0",
        data_anak: []
    }
  });

  const jumlahAnakValue = watch("jumlah_anak");

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (step === 1) fieldsToValidate = ["nama_lengkap", "email", "password", "no_telepon", "alamat"];
    if (step === 2) fieldsToValidate = ["nik_ibu", "tempat_lahir_ibu", "tanggal_lahir_ibu", "jumlah_anak", "jenis_kelamin_ibu"];
    if (step === 3) fieldsToValidate = ["nama_suami", "nik_suami"];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // PERBAIKAN 4: Gunakan SubmitHandler<FormData> untuk typing fungsi onSubmit
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const clerkResult = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      if (clerkResult.status === "complete" || clerkResult.status === "missing_requirements") {
        const userId = clerkResult.createdUserId; 

        if (userId) {
             // 1. Insert Profil Ibu
             const { error: profileError } = await supabase.from('profiles').insert({
                id: userId,
                nama_lengkap: data.nama_lengkap,
                email: data.email,
                nik: data.nik_ibu,
                jenis_kelamin: data.jenis_kelamin_ibu,
                alamat: data.alamat,
                no_telepon: data.no_telepon,
                no_jkn: data.no_jkn_ibu,
                faskes: data.faskes_ibu,
                pendidikan_terakhir: data.pendidikan_ibu,
                pekerjaan: data.pekerjaan_ibu,
                gol_darah: data.gol_darah_ibu,
                tempat_lahir: data.tempat_lahir_ibu,
                tanggal_lahir: data.tanggal_lahir_ibu,
                asuransi: data.asuransi_ibu
             });

             if (profileError) throw new Error("Gagal simpan profil: " + profileError.message);

             // 2. Insert Suami
             await supabase.from('suami').insert({
                profile_id: userId,
                nama_lengkap: data.nama_suami,
                nik: data.nik_suami,
                jenis_kelamin: data.jenis_kelamin_suami,
                alamat: data.alamat_suami || data.alamat,
                no_telepon: data.no_telepon_suami,
                no_jkn: data.no_jkn_suami,
                faskes: data.faskes_suami,
                pendidikan_terakhir: data.pendidikan_suami,
                pekerjaan: data.pekerjaan_suami,
                gol_darah: data.gol_darah_suami,
                tempat_lahir: data.tempat_lahir_suami,
                tanggal_lahir: data.tanggal_lahir_suami ? data.tanggal_lahir_suami : null,
                asuransi: data.asuransi_suami
             });

             // 3. Insert Anak
             const countAnak = parseInt(data.jumlah_anak || "0");
             // Validasi aman untuk array anak
             if (countAnak > 0 && data.data_anak && Array.isArray(data.data_anak) && data.data_anak.length > 0) {
                const anakToInsert = data.data_anak.slice(0, countAnak).map((anak: any) => ({
                    profile_id: userId,
                    nama_lengkap: anak.nama,
                    nik: anak.nik,
                    jenis_kelamin: anak.jenis_kelamin,
                    anak_ke: parseInt(anak.anak_ke || "0"),
                    no_jkn: anak.jkn,
                    tempat_lahir: anak.tempat_lahir,
                    tanggal_lahir: anak.tanggal_lahir ? anak.tanggal_lahir : null
                }));

                const { error: anakError } = await supabase.from('anak').insert(anakToInsert);
                if(anakError) console.error("Gagal simpan anak", anakError);
             }

             // 4. Insert Riwayat
             await supabase.from('riwayat_kesehatan_ibu').insert({
                 profile_id: userId,
                 kehamilan_ke: parseInt(data.kehamilan_ke || "1"),
                 riwayat_keguguran: data.riwayat_keguguran,
                 riwayat_penyakit: data.riwayat_penyakit
             });

            if(clerkResult.createdSessionId){
                await setActive({ session: clerkResult.createdSessionId });
                router.push("/user/dashboard");
                toast.success("Pendaftaran Berhasil!");
            } else {
                await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                router.push("/sign-up/verify");
                toast.success("Silakan verifikasi email Anda.");
            }
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal Mendaftar", { description: err.errors?.[0]?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, id, type = "text", placeholder, registerRef }: any) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="font-semibold text-gray-700">{label}</Label>
        <Input 
            {...register(registerRef || id)} 
            type={type} 
            placeholder={placeholder} 
            className="h-12 border-gray-400 rounded-md focus:border-[#1abc9c] focus:ring-[#1abc9c]" 
        />
    </div>
  );

  const SelectField = ({ label, onValueChange, defaultValue, placeholder, options }: any) => (
    <div className="space-y-2">
      <Label className="font-semibold text-gray-700">{label}</Label>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger className="h-12 border-gray-400">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt: any) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="w-full max-w-2xl border border-gray-400 rounded-lg shadow-sm bg-white overflow-hidden">
      
      {/* Header */}
      <div className="bg-white p-6 pb-2 text-center">
         <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
               <Sprout className="h-8 w-8 text-[#a3cb38]" /> 
               <span className="text-2xl font-bold text-[#d4e157] tracking-wider">SIPOCEM</span>
            </div>
         </div>
         {step > 1 && (
             <div className="flex items-start mb-6">
                 <span className="text-gray-500 underline underline-offset-4">Langkah {step} dari 6</span>
             </div>
         )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">
        <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            {/* --- STEP 1: AKUN UTAMA --- */}
            {step === 1 && (
                <>
                    <h2 className="text-2xl font-bold text-[#1abc9c] text-center mb-6">Daftar SIPOCEM</h2>
                    
                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Nama Lengkap</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <Input {...register("nama_lengkap")} className="pl-10 h-12 border-gray-400" placeholder="Masukkan nama lengkap" />
                        </div>
                        {errors.nama_lengkap && <p className="text-red-500 text-xs">{errors.nama_lengkap.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <Input {...register("email")} type="email" className="pl-10 h-12 border-gray-400" placeholder="nama@email.com" />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Kata Sandi</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <Input 
                                {...register("password")} 
                                type={showPassword ? "text" : "password"} 
                                className="pl-10 pr-10 h-12 border-gray-400" 
                                placeholder="******" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Password harus memiliki minimal 8 karakter</p>
                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">No. Telepon</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <Input {...register("no_telepon")} className="pl-10 h-12 border-gray-400" placeholder="08123..." />
                        </div>
                        {errors.no_telepon && <p className="text-red-500 text-xs">{errors.no_telepon.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Alamat</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <Input {...register("alamat")} className="pl-10 h-12 border-gray-400" placeholder="Alamat lengkap" />
                        </div>
                        {errors.alamat && <p className="text-red-500 text-xs">{errors.alamat.message}</p>}
                    </div>
                </>
            )}

            {/* --- STEP 2: IDENTITAS IBU --- */}
            {step === 2 && (
                <>
                    <h2 className="text-xl font-bold text-black text-center mb-6">IDENTITAS IBU</h2>
                    <InputField id="nik_ibu" label="NIK" placeholder="" />
                    
                    <SelectField 
                        label="Jenis Kelamin" 
                        placeholder="Pilih Jenis Kelamin" 
                        defaultValue="Perempuan"
                        onValueChange={(val: string) => setValue("jenis_kelamin_ibu", val)}
                        options={[{value: "Perempuan", label: "Perempuan"}, {value: "Laki-laki", label: "Laki-laki"}]}
                    />

                    <InputField id="no_jkn_ibu" label="No. JKN" placeholder="" />
                    <InputField id="faskes_ibu" label="Faskes" placeholder="" />
                    <InputField id="pendidikan_ibu" label="Pendidikan Terakhir" placeholder="" />
                    <InputField id="pekerjaan_ibu" label="Pekerjaan" placeholder="" />
                    <InputField id="gol_darah_ibu" label="Gol. Darah" placeholder="" />
                    <InputField id="tempat_lahir_ibu" label="Tempat Lahir" placeholder="" />
                    <InputField id="tanggal_lahir_ibu" label="Tanggal Lahir" type="date" />
                    <InputField id="asuransi_ibu" label="Asuransi" placeholder="" />
                    
                    <div className="space-y-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Label className="font-bold text-gray-800">Jumlah Anak Saat Ini</Label>
                        <Input 
                            {...register("jumlah_anak")} 
                            type="number" 
                            min="0"
                            placeholder="Contoh: 2" 
                            className="h-12 border-gray-400 bg-white" 
                        />
                        <p className="text-xs text-gray-500">Masukkan 0 jika belum memiliki anak.</p>
                        {errors.jumlah_anak && <p className="text-red-500 text-xs">{errors.jumlah_anak.message}</p>}
                    </div>
                </>
            )}

            {/* --- STEP 3: IDENTITAS SUAMI --- */}
            {step === 3 && (
                <>
                    <h2 className="text-xl font-bold text-black text-center mb-6">IDENTITAS SUAMI</h2>
                    <InputField id="nama_suami" label="Nama Lengkap" placeholder="" />
                    <InputField id="nik_suami" label="NIK" placeholder="" />
                    
                    <SelectField 
                        label="Jenis Kelamin" 
                        placeholder="Pilih Jenis Kelamin" 
                        defaultValue="Laki-laki"
                        onValueChange={(val: string) => setValue("jenis_kelamin_suami", val)}
                        options={[{value: "Laki-laki", label: "Laki-laki"}, {value: "Perempuan", label: "Perempuan"}]}
                    />

                    <InputField id="alamat_suami" label="Alamat" placeholder="Kosongkan jika sama dengan Ibu" />
                    <InputField id="no_jkn_suami" label="No. JKN" />
                    <InputField id="faskes_suami" label="Faskes" />
                    <InputField id="pendidikan_suami" label="Pendidikan Terakhir" />
                    <InputField id="pekerjaan_suami" label="Pekerjaan" />
                    <InputField id="gol_darah_suami" label="Gol. Darah" />
                    <InputField id="tempat_lahir_suami" label="Tempat Lahir" />
                    <InputField id="tanggal_lahir_suami" label="Tanggal Lahir" type="date" />
                    <InputField id="asuransi_suami" label="Asuransi" />
                    <InputField id="no_telepon_suami" label="No. Telepon" />
                </>
            )}

             {/* --- STEP 4: IDENTITAS ANAK (DYNAMIC) --- */}
             {step === 4 && (
                <>
                    <h2 className="text-xl font-bold text-black text-center mb-6">IDENTITAS ANAK</h2>
                    
                    {parseInt(jumlahAnakValue || "0") === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-md">
                            <p className="text-gray-500">Anda tidak memasukkan jumlah anak di langkah 2.</p>
                            <Button variant="link" onClick={() => setStep(2)} className="text-[#1abc9c]">Edit Jumlah Anak</Button>
                        </div>
                    ) : (
                        Array.from({ length: parseInt(jumlahAnakValue || "0") }).map((_, index) => (
                            <div key={index} className="p-4 border rounded-lg mb-6 bg-gray-50 relative">
                                <div className="absolute top-0 left-0 bg-[#1abc9c] text-white px-3 py-1 text-sm font-bold rounded-tl-lg rounded-br-lg">
                                    Anak Ke-{index + 1}
                                </div>
                                <div className="mt-4 space-y-4">
                                    <InputField 
                                        registerRef={`data_anak.${index}.nama`} 
                                        label="Nama Lengkap" 
                                        placeholder={`Nama Anak ke-${index + 1}`} 
                                    />
                                    <InputField 
                                        registerRef={`data_anak.${index}.nik`} 
                                        label="NIK" 
                                    />
                                    <InputField 
                                        registerRef={`data_anak.${index}.anak_ke`} 
                                        label="Anak Ke Berapa"
                                        placeholder={(index + 1).toString()}
                                    />
                                    
                                    <div className="space-y-2">
                                        <Label className="font-semibold text-gray-700">Jenis Kelamin</Label>
                                        <Select onValueChange={(val) => setValue(`data_anak.${index}.jenis_kelamin` as any, val)}>
                                            <SelectTrigger className="h-12 border-gray-400 bg-white">
                                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <InputField 
                                        registerRef={`data_anak.${index}.jkn`} 
                                        label="No. JKN" 
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField 
                                            registerRef={`data_anak.${index}.tempat_lahir`} 
                                            label="Tempat Lahir" 
                                        />
                                        <InputField 
                                            registerRef={`data_anak.${index}.tanggal_lahir`} 
                                            label="Tanggal Lahir" 
                                            type="date"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </>
            )}

            {/* --- STEP 5: DATA KEHAMILAN --- */}
            {step === 5 && (
                <>
                    <h2 className="text-xl font-bold text-black text-center mb-6">DATA KEHAMILAN</h2>
                    <InputField id="hpht" label="HPHT" type="date" />
                    <InputField id="taksiran_persalinan" label="Taksiran Persalinan" type="date" />
                </>
            )}

            {/* --- STEP 6: RIWAYAT & KONFIRMASI --- */}
            {step === 6 && (
                <>
                   <h2 className="text-xl font-bold text-black text-center mb-6">RIWAYAT & KONFIRMASI</h2>
                   <InputField id="kehamilan_ke" label="Kehamilan Ke" />
                   <InputField id="riwayat_keguguran" label="Riwayat Keguguran" />
                   <InputField id="riwayat_penyakit" label="Riwayat Penyakit" />
                   
                   <div className="flex items-center space-x-2 mt-6 pt-4 border-t">
                        <Checkbox id="terms" onCheckedChange={(val) => {
                            const event = { target: { name: 'terms', value: val } };
                            register("terms").onChange(event);
                        }} {...register("terms")} />
                        <label htmlFor="terms" className="text-sm font-medium text-[#1abc9c]">
                            Saya menyetujui <a href="#" className="underline">Syarat & Ketentuan</a>
                        </label>
                    </div>
                </>
            )}

        </motion.div>

        {/* BUTTON NAVIGATION */}
        <div className="flex justify-between mt-8 pt-4">
            {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} className="border-[#1abc9c] text-[#1abc9c] hover:bg-teal-50 px-6 rounded-md h-11">
                    Kembali
                </Button>
            ) : <div />}

            {step < 6 ? (
                <Button type="button" onClick={nextStep} className="bg-white border border-[#1abc9c] text-[#1abc9c] hover:bg-[#1abc9c] hover:text-white px-8 rounded-md h-11 font-bold">
                    Lanjut
                </Button>
            ) : (
                <Button type="submit" disabled={loading} className="bg-[#1abc9c] hover:bg-[#16a085] text-white px-10 rounded-md h-11 font-bold shadow-md">
                    {loading ? "Memproses..." : "Daftar"}
                </Button>
            )}
        </div>

      </form>
    </div>
  );
}
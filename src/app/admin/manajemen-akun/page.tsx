import { getAllUsers } from "@/app/actions/admin-actions";
import { Badge } from "@/components/ui/badge";
import { UserDialog } from "@/components/admin/user-dialog";
import { DeleteUserButton } from "@/components/admin/delete-user-button";

export const revalidate = 0;

// ✅ 1. Update Type Account: Tambahkan email
type Account = {
  id: string;
  nik: string;
  nama_lengkap: string;
  username: string;
  email: string; // <-- Tambahan baru
  no_telepon: string;
  role: string;
  status: string;
  created_at: string;
};

export default async function ManajemenAkunPage() {
  const accounts = await getAllUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1abc9c]">Manajemen Akun</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-600 font-medium text-lg">Daftar Akun</h2>
          <UserDialog mode="create" />
        </div>

        <div className="overflow-x-auto rounded-t-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#d4e157] text-black uppercase font-bold text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-center w-12">No</th>
                <th className="px-4 py-3">NIK</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Username</th>
                {/* ✅ 2. Tambahkan Header Email */}
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">No HP</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {accounts?.map((account: Account, index: number) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3">{account.nik}</td>
                  <td className="px-4 py-3 font-medium capitalize">
                    {account.nama_lengkap}
                  </td>
                  <td className="px-4 py-3">{account.username}</td>
                  {/* ✅ 3. Tampilkan Data Email */}
                  <td className="px-4 py-3 text-gray-600">{account.email}</td>
                  <td className="px-4 py-3">{account.no_telepon}</td>
                  <td className="px-4 py-3">{account.role}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={
                        account.status === "Nonaktif"
                          ? "text-red-600 bg-red-50 border-red-200"
                          : "text-green-600 bg-green-50 border-green-200"
                      }
                    >
                      {account.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <UserDialog mode="edit" user={account} />
                      <DeleteUserButton
                        userId={account.id}
                        userName={account.nama_lengkap}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {(!accounts || accounts.length === 0) && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    Belum ada data akun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
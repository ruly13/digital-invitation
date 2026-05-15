import { FormData } from '@/hooks/useEditorData';
import { Plus, Trash2 } from 'lucide-react';

interface EditorTabAmplopProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDarkMode: boolean;
}

export default function EditorTabAmplop({ formData, setFormData, isDarkMode }: EditorTabAmplopProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Amplop Digital / Kado Fisik</h2>
      
      {/* Rekening Bank */}
      <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Nomor Rekening</h3>
          <button 
            onClick={() => setFormData({...formData, bankAccounts: [...formData.bankAccounts, { bank: '', accountName: '', accountNumber: '' }]})}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Tambah Rekening
          </button>
        </div>
        
        {formData.bankAccounts.map((account, index) => (
          <div key={`bank-${index}`} className={`mb-4 p-4 border rounded-xl relative ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
            <button 
              onClick={() => setFormData({
                ...formData, 
                bankAccounts: formData.bankAccounts.filter((_, i) => i !== index)
              })} 
              className="absolute right-3 top-3 text-stone-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Nama Bank</label>
                <input type="text" value={account.bank} onChange={(e) => {
                  const newAccounts = [...formData.bankAccounts];
                  newAccounts[index].bank = e.target.value;
                  setFormData({...formData, bankAccounts: newAccounts});
                }} placeholder="BCA / Mandiri / BNI / BRI" className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>No Rekening</label>
                  <input type="text" value={account.accountNumber} onChange={(e) => {
                    const newAccounts = [...formData.bankAccounts];
                    newAccounts[index].accountNumber = e.target.value;
                    setFormData({...formData, bankAccounts: newAccounts});
                  }} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Atas Nama</label>
                  <input type="text" value={account.accountName} onChange={(e) => {
                    const newAccounts = [...formData.bankAccounts];
                    newAccounts[index].accountName = e.target.value;
                    setFormData({...formData, bankAccounts: newAccounts});
                  }} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {formData.bankAccounts.length === 0 && <p className="text-sm text-stone-500 italic">Belum ada rekening yang ditambahkan.</p>}
      </div>

      {/* E-Wallet */}
      <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>E-Wallet (GoPay/OVO/Dana/dll)</h3>
          <button 
            onClick={() => setFormData({...formData, digitalWallets: [...formData.digitalWallets, { ewallet: '', accountName: '', accountNumber: '' }]})}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Tambah E-Wallet
          </button>
        </div>
        
        {formData.digitalWallets.map((wallet, index) => (
            <div key={`wallet-${index}`} className={`mb-4 p-4 border rounded-xl relative ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
              <button 
                onClick={() => setFormData({
                  ...formData, 
                  digitalWallets: formData.digitalWallets.filter((_, i) => i !== index)
                })} 
                className="absolute right-3 top-3 text-stone-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Jenis E-Wallet</label>
                  <input type="text" value={wallet.ewallet} onChange={(e) => {
                    const newWallets = [...formData.digitalWallets];
                    newWallets[index].ewallet = e.target.value;
                    setFormData({...formData, digitalWallets: newWallets});
                  }} placeholder="OVO / GoPay / Dana / ShopeePay" className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>No. Akun / HP</label>
                    <input type="text" value={wallet.accountNumber} onChange={(e) => {
                      const newWallets = [...formData.digitalWallets];
                      newWallets[index].accountNumber = e.target.value;
                      setFormData({...formData, digitalWallets: newWallets});
                    }} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Atas Nama</label>
                    <input type="text" value={wallet.accountName} onChange={(e) => {
                      const newWallets = [...formData.digitalWallets];
                      newWallets[index].accountName = e.target.value;
                      setFormData({...formData, digitalWallets: newWallets});
                    }} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {formData.digitalWallets.length === 0 && <p className="text-sm text-stone-500 italic">Belum ada e-wallet yang ditambahkan.</p>}
      </div>

      {/* Alamat Pengiriman Kado Fisik */}
      <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <h3 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Alamat Pengiriman Kado Fisik</h3>
        <textarea
          rows={4}
          value={formData.shippingAddress}
          onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
          placeholder="Contoh: Jl. Mawar No. 123, RT 01/RW 02, Kec. Melati, Jakarta Pusat 10000 (Penerima: Budi / 08123456789)"
          className={`w-full px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
        ></textarea>
      </div>
    </div>
  );
}

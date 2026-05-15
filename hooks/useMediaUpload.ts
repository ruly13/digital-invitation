import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import { FormData } from './useEditorData';

export function useMediaUpload(formData: FormData, setFormData: React.Dispatch<React.SetStateAction<FormData>>) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'bank' | 'wallet', index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id || 'public';
      const fileExt = file.name.split('.').pop();
      const fileName = `qris-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);
        
      if (type === 'bank') {
        const newAccounts = [...formData.bankAccounts];
        newAccounts[index].qrisUrl = publicUrl;
        setFormData({ ...formData, bankAccounts: newAccounts });
      } else {
        const newWallets = [...formData.digitalWallets];
        newWallets[index].qrisUrl = publicUrl;
        setFormData({ ...formData, digitalWallets: newWallets });
      }
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error uploading QR:', error);
      alert('Gagal mengunggah QR Code. Pastikan ukuran file tidak terlalu besar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File audio maksimal 5MB agar mudah dimuat!');
        return;
      }
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop() || 'mp3';
        const fileName = `audio_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        setFormData(prev => ({
          ...prev,
          musicUrl: publicUrl
        }));
        
        setShowUploadSuccess(true);
        setTimeout(() => setShowUploadSuccess(false), 3000);
      } catch (err) {
        console.error("Gagal mengunggah musik:", err);
        alert("Gagal mengunggah musik");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          fileType: 'image/webp'
        };
        
        let fileToUpload = file;
        try {
          // @ts-ignore
          fileToUpload = await imageCompression(file, options);
          const blob = fileToUpload as Blob;
          fileToUpload = new File([blob], file.name.replace(/\\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
        } catch (comprErr) {
          console.error("Gagal kompresi, gunakan file asli", comprErr);
        }
        
        const fileExt = 'webp';
        const fileName = `${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        
        const { error } = await supabase.storage
          .from('gallery')
          .upload(filePath, fileToUpload);
          
        if (error) {
          console.error('Error uploading image:', error);
          alert('Gagal mengunggah foto. Coba lagi.');
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);
          
        newImages.push(publicUrl);
      }

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newImages],
      }));

      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Error saat kompresi/mengunggah:', error);
      alert('Terjadi kesalahan unggahan!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, storyIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: 'image/webp' as const,
      };

      let fileToUpload: File = file;
      try {
        // @ts-ignore
        const compressed = await imageCompression(file, options);
        fileToUpload = new File([compressed], file.name.replace(/\\.[^/.]+$/, '') + '.webp', { type: 'image/webp' });
      } catch {
      }

      const fileName = `story_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.webp`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage.from('gallery').upload(filePath, fileToUpload);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);

      const newStories = [...formData.loveStories];
      newStories[storyIndex] = { ...newStories[storyIndex], imageUrl: publicUrl };
      setFormData({ ...formData, loveStories: newStories });

      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal upload foto kisah cinta:', err);
      alert('Gagal mengunggah foto. Coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const imgUrl = formData.gallery[index];
    if (imgUrl.includes('supabase.co/storage/v1/object/public/gallery/')) {
        const filePath = imgUrl.split('public/gallery/')[1];
        supabase.storage.from('gallery').remove([filePath]).catch(console.error);
    }

    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    setFormData(prev => {
      const newGallery = [...prev.gallery];
      if (direction === 'left' && index > 0) {
        [newGallery[index - 1], newGallery[index]] = [newGallery[index], newGallery[index - 1]];
      } else if (direction === 'right' && index < newGallery.length - 1) {
        [newGallery[index + 1], newGallery[index]] = [newGallery[index], newGallery[index + 1]];
      }
      return { ...prev, gallery: newGallery };
    });
  };

  return {
    isUploading,
    showUploadSuccess,
    handleQRUpload,
    handleAudioUpload,
    handleImageUpload,
    handleStoryImageUpload,
    removeImage,
    moveImage
  };
}

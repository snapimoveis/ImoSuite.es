
import { storage } from "../lib/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export const StorageService = {
  /**
   * Sube una imagen Base64 al Firebase Storage de España.
   * Lanza un error si falla para evitar guardar strings pesados en Firestore.
   */
  async uploadBase64(path: string, base64: string): Promise<string> {
    if (!base64 || !base64.startsWith('data:image')) {
      return base64;
    }
    
    try {
      const storageRef = ref(storage, path);
      // 'data_url' es el formato correcto para strings que comienzan con "data:image/..."
      await uploadString(storageRef, base64, 'data_url');
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error: any) {
      console.error("ERROR CRÍTICO EN STORAGE:", error);
      
      if (error.code === 'storage/unauthorized') {
        throw new Error("PERMISO DENEGADO: Por favor, actualice las 'Rules' del Storage en Firebase Console para permitir escritura a usuarios autenticados.");
      }
      
      throw error;
    }
  }
};

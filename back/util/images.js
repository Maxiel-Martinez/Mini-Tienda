import cloudinary from "../config/cloudinary.js"

/**
 * Sube una imagen a Cloudinary y devuelve la información resultante.
 *
 * Esta función convierte el archivo recibido en formato base64 y lo sube
 * al servicio de Cloudinary dentro de la carpeta "products". Devuelve el
 * identificador público y la URL segura de la imagen subida.
 *
 * @async
 * @function uploadImageToCloudinary
 * @param {Object} file - Objeto del archivo que contiene la información de la imagen.
 * @param {Buffer} file.buffer - El contenido binario del archivo.
 * @param {string} file.mimetype - El tipo MIME del archivo (por ejemplo, 'image/jpeg').
 * @returns {Promise<{publicId: string, url: string} | Error>} Un objeto con el `publicId` y la `url` de la imagen subida,
 * o un error en caso de fallo durante la carga.
 */
export const uploadImageToCloudinary = async (file) => {
  try {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      const uploadImage = await cloudinary.uploader.upload(base64Image, { folder: 'products' });
      return {publicId: uploadImage.public_id, url: uploadImage.secure_url};
  } catch (error) {
    return error
  }
}

/**
 * Elimina una imagen de Cloudinary utilizando su identificador público.
 *
 * Esta función intenta eliminar una imagen previamente subida a Cloudinary
 * usando el `publicId` proporcionado. Devuelve un objeto indicando si la operación
 * fue exitosa o si ocurrió algún error durante el proceso.
 *
 * @async
 * @function deleteImageFromCloudinary
 * @param {string} publicId - El identificador público de la imagen en Cloudinary.
 * @returns {Promise<{success: boolean, message: string}>} Un objeto que indica el resultado de la operación:
 * - `success: true` si la imagen fue eliminada correctamente.
 * - `success: false` si hubo un error o la imagen no se encontró.
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      return { success: false, message: 'Failed to delete image from Cloudinary' };
    }
    if (result.result === 'not found'){
      return { success: false, message: 'Image not found in Cloudinary' };
    }
    return { success: true, message: 'Image deleted successfully from Cloudinary' };
  } catch (error) {
    return { success: false, message: 'Error deleting image from Cloudinary' || 'unknown error' };
  }
}

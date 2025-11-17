import { PedidosModel } from "../models/pedidosModel.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../util/images.js";

export class PedidosController{
  static async getAllPedidos(req, res) {
    const pedidos = await PedidosModel.getAllPedidos();
    if (pedidos instanceof Error) {
      return res.status(404).json({success: false, error: pedidos.message });
    }
    res.status(200).json({succes: true, pedidos});
  }

  static async createPedido(req, res){
    let imageUploaded = null
    try {
      const pedidoData = req.body;
      if (req.file){
        const imageUpload = await uploadImageToCloudinary(req.file)
        if (imageUpload instanceof Error) {
          throw imageUpload;
        }
        imageUploaded = {public_id: imageUpload?.publicId, secure_url: imageUpload?.url};
        pedidoData.imagen_url = imageUpload?.url;
        pedidoData.imagen_public_id = imageUpload?.publicId;
      }

      const newPedido = await PedidosModel.createPedido(pedidoData);
      if (newPedido instanceof Error) {
        return  res.status(500).json({ success: false, error: newPedido.message });
      }
      res.status(201).json({succes: true, newPedido});
    } catch (error) {
      const deleteImage = await deleteImageFromCloudinary(imageUploaded.public_id);
      return res.status(500).json({ success: false,  error: 'Error creating the pedido', deleteStatus: deleteImage });
    }
  }
}

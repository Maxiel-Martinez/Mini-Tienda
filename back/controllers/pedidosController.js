import { PedidosModel } from "../models/pedidosModel.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../util/images.js";

export class PedidosController{
  static async getAllPedidos(req, res) {
    const pedidos = await PedidosModel.getAllPedidos();
    if (pedidos instanceof Error) {
      return res.status(404).json({success: false, error: pedidos.message });
    }
    res.status(200).json({success: true, pedidos});
  }

  static async getPedidoById(req, res) {
    const { pedido_id } = req.params;
    const pedido = await PedidosModel.getPedidoById(pedido_id);
    if (pedido instanceof Error) {
      return res.status(404).json({success: false, error: pedido.message });
    }
    res.status(200).json({success: true, pedido});
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
        throw newPedido;
      }
      res.status(201).json({success: true, newPedido});
    } catch (error) {
      const deleteImage = await deleteImageFromCloudinary(imageUploaded.public_id);
      return res.status(500).json({ success: false,  error: 'Error creating the pedido', deleteStatus: deleteImage });
    }
  }

  static async getPedidoStats(req, res){
    const stats = await PedidosModel.getPedidoStats()
    if (stats instanceof Error) {
      return res.status(500).json({success: false, error: stats.message })
    }
    res.status(200).json({success: true, stats})
  }
}

export const requiresAuth = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ succes: false, msg: "No autorizado" });
  }
  next();
};

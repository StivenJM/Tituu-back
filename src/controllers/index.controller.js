export const index = (req, res) => {
  res.status(200).json({
    message: "Bienvenido a la API de Titu",
    version: "1.0.0",
    routes: {
      clients: "/api/clients",
    },
  });
};
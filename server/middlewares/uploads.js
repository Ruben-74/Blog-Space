import multer from "multer";

// Liste des extensions d'image valides
const validExtensions = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Dossier de destination
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Conserver le nom d'origine
  },
});

// Filtre pour valider le type de fichier
const fileFilter = (req, file, cb) => {
  if (validExtensions.includes(file.mimetype)) {
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error("Veuillez télécharger un fichier image valide."), false); // Rejeter le fichier
  }
};

// Créer l'instance de multer avec la configuration et les validations
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite de taille du fichier à 2 Mo
  fileFilter,
});

// Exporter le middleware pour l'utiliser dans les routes
export const uploadImage = upload.single("image");

import Post from "../model/Post.js";
import path from "path";
import sharp from "sharp";

const IMAGE_DIR = path.join(process.cwd(), "public/images");

//Creation d'un article
const create_post = async (req, res) => {
  try {
    const { title, description, categoryId, userId } = req.body;

    if (!title || !description || !categoryId || !userId) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    let imageData = null;

    if (req.file) {
      try {
        const imagePath = path.join(IMAGE_DIR, req.file.filename);

        // Redimensionner et sauvegarder l'image avec Sharp
        await sharp(imagePath)
          .resize(500, 300, { fit: sharp.fit.cover })
          .toBuffer();

        imageData = {
          url: `${req.file.filename}`,
          alt_img: `Une image de ${path.basename(
            req.file.originalname,
            path.extname(req.file.originalname)
          )}`,
        };

        console.log("Image redimensionnée et sauvegardée avec succès.");
      } catch (fileError) {
        console.error(
          "Erreur lors du traitement de l'image :",
          fileError.message
        );
        return res
          .status(500)
          .json({ error: "Erreur lors du traitement de l'image." });
      }
    }

    const postData = {
      title,
      description,
      user_id: userId,
      categoryId,
      image: imageData,
    };

    const postId = await Post.create(postData);

    res.status(201).json({ message: "Post créé avec succès", postId });
  } catch (error) {
    console.error("Erreur :", error.message);
    res.status(500).json({ error: "Impossible de créer le post." });
  }
};

//Modification d'un article
const update_post = async (req, res) => {
  try {
    const { title, description, userId, categoryId } = req.body;
    const postId = req.params.id;

    console.log("ID du post :", postId);
    console.log("Body :", req.body);

    let imageData = null;

    // Gestion de l'image
    if (req.file) {
      const imagePath = path.join(IMAGE_DIR, req.file.filename);
      await sharp(imagePath)
        .resize(500, 300, { fit: sharp.fit.cover })
        .toBuffer();

      imageData = {
        url: `${Date.now()}-${req.file.filename}`,
        alt_img: `Une image de ${path.basename(
          req.file.originalname,
          path.extname(req.file.originalname)
        )}`,
      };
    }

    const postData = {
      title,
      description,
      userId: Number(userId),
      categoryId: Number(categoryId),
      postId,
      image: imageData,
    };

    console.log("Body :", postData);

    await Post.update(postData);

    res.status(200).json({ message: "Post mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur interne:", err.message);
    res.status(500).json({
      error: "Une erreur interne est survenue.",
      details: err.message,
    });
  }
};

//Suppression d'un post
const delete_post = async (req, res) => {
  const postId = req.params.id;

  try {
    await Post.getOneById(postId);

    await Post.remove(postId);

    return res.json({ msg: "Post supprimé", id: postId });
  } catch (err) {
    console.error(`Erreur dans delete_post (ID : ${postId}) :`, err.message);
    return res
      .status(500)
      .json({ error: "Erreur lors de la suppression du post." });
  }
};

export { create_post, update_post, delete_post };

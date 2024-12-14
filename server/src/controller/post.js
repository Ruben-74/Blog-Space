import Post from "../model/Post.js";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";

const IMAGE_DIR = path.join(process.cwd(), "public/images");

const create_post = async (req, res) => {
  try {
    const { title, description, categoryId, userId } = req.body;

    if (!title || !description || !categoryId || !userId) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    // Gérer l'image si elle existe
    let imageData = null;
    if (req.file) {
      const imagePath = path.join("public/images", req.file.filename);
      const outputImagePath = path.join(
        "public/images",
        `IMG_${req.file.filename}`
      );

      await sharp(imagePath)
        .resize(500, 300, { fit: sharp.fit.cover })
        .toFile(outputImagePath);

      imageData = {
        url: `IMG_${req.file.filename}`,
        alt_img: path.basename(
          req.file.filename,
          path.extname(req.file.filename)
        ),
      };
    }

    // Créer le post
    const postData = {
      title,
      description,
      user_id: userId,
      categoryId,
      image: imageData,
    };

    console.log("Post Data:", postData);

    const postId = await Post.create(postData); // Crée le post

    res.status(201).json({ message: "Post créé avec succès", postId });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error.message);
    res.status(500).json({ error: "Erreur lors de la création du post." });
  }
};

const update_post = async (req, res) => {
  try {
    const { title, description, categoryId, userId } = req.body;
    const postId = req.params.id;

    // Vérification des champs requis
    if (!title || !description || !categoryId || !userId) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    // Vérification si le post existe
    const existingPost = await Post.getOneById(postId);
    if (!existingPost) {
      return res.status(404).json({ error: "Post non trouvé." });
    }

    let imageData = existingPost.image; // Conserver l'image existante par défaut

    // Si un nouveau fichier est téléchargé
    if (req.file) {
      const imagePath = path.join(IMAGE_DIR, req.file.filename);
      const outputImagePath = path.join(IMAGE_DIR, `IMG_${req.file.filename}`);

      try {
        // Redimensionner et sauvegarder l'image
        await sharp(imagePath)
          .resize(500, 300, { fit: sharp.fit.cover })
          .toFile(outputImagePath);

        imageData = {
          url: `IMG_${req.file.filename}`, // Nouveau nom d'image
          alt_img: path.basename(
            req.file.filename,
            path.extname(req.file.filename)
          ),
        };
      } catch (fileError) {
        console.error(
          "Erreur lors du traitement de l'image:",
          fileError.message
        );
        return res
          .status(500)
          .json({ error: "Erreur lors du traitement de l'image." });
      }
    }

    // Préparation des données de mise à jour
    const postData = {
      title,
      description,
      categoryId,
      userId,
      image: imageData,
      postId,
    };

    // Appel de la méthode de mise à jour dans le modèle Post
    await Post.update(postData);

    res.status(200).json({ message: "Post mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post:", error.message);
    res.status(500).json({ error: "Erreur lors de la mise à jour du post." });
  }
};

const delete_post = async (req, res) => {
  const postId = req.params.id;

  try {
    const product = await Post.getOneById(postId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ msg: "Post non trouvé." });
    }

    // Remove the product from the database
    const response = await Post.remove(postId);

    // Check if the deletion was successful
    if (!response.affectedRows) {
      return res.status(404).json({ msg: "Post non trouvé." });
    }

    // Check if the image should be deleted
    if (
      product.image &&
      product.image.url &&
      product.image.url !== "no-pict.jpg"
    ) {
      const imagePath = path.join("public/images", product.image.url);

      try {
        await fs.unlink(imagePath); // Attempt to delete the image
        console.log(`Image supprimée: ${imagePath}`);
      } catch (fileErr) {
        if (fileErr.code === "ENOENT") {
          console.warn(`Fichier non trouvé: ${imagePath}`);
        } else {
          console.error(
            `Erreur lors de la suppression (ID: ${postId}):`,
            fileErr.message
          );
        }
      }
    }

    return res.json({ msg: "Post supprimé", id: postId });
  } catch (err) {
    console.error(`Erreur dans delete_post (ID: ${postId}):`, err.message);
    return res
      .status(500)
      .json({ error: "Erreur lors de la suppression du post." });
  }
};

export { create_post, update_post, delete_post };

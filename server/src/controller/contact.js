import Contact from "../model/Contact.js";
import { sendEmail } from "../services/nodemailer.js";

const getAll = async (req, res) => {
  try {
    const response = await Contact.findAll();
    res.json(response);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const create = async (req, res) => {
  const { username, email, content } = req.body;

  try {
    // Validate input
    if (!username || !email || !content) {
      return res.status(400).json({ msg: "Tous les champs sont requis." });
    }

    // Use the create method from the Contact model
    const newContactId = await Contact.create(username, email, content);

    // Respond with the ID of the newly created contact
    res
      .status(201)
      .json({ msg: "Contact créé avec succès.", id: newContactId });
  } catch (err) {
    console.error("Erreur lors de la création du contact:", err);
    res.status(500).json({ msg: err.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params; // Récupère l'id du contact
  const { status } = req.body; // Récupère le nouveau statut

  try {
    const result = await Contact.update(id, status);
    res.status(200).json(result); // Renvoie le résultat
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
};

const remove = async (req, res) => {
  try {
    const [response] = await Contact.remove(req.params.id);
    console.log(response);
    if (!response.affectedRows) {
      res.status(404).json({ msg: "Contact not found" });
      return;
    }
    console.log(response);
    res.json({ msg: "Contact deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const replyToContact = async (req, res) => {
  const { email, subject, content } = req.body;

  try {
    await sendEmail(email, subject, content);
    res.status(200).json({ msg: "Réponse envoyée avec succès!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export { getAll, create, update, remove, replyToContact };

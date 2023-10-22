const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchUser = require("../middlewares/fetchuser");
const { body, validationResult } = require("express-validator");

// Route 1: Get all notes using : get "api/notes/fetchallnotes" . Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});
// Route 2: Add a new note using : POST "api/notes/addnote" . Login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("description", "Description must be atleast 3 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes = new Notes({ user: req.user.id, title, description, tag });
      const savedNotes = await notes.save();
      res.json(savedNotes);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
// Route 3: Add a new note using : put "api/notes/updatenote" . Login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id)
      return response.status(401).send("Not Allowed");
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal server error");
  }
});
// Route 4: Add a new note using : delete "api/notes/delete" . Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
    try {
      //Find the note to be deleted and delete it
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found");
      }
      if (note.user.toString() !== req.user.id)
        return response.status(401).send("Not Allowed");
      note = await Notes.findByIdAndDelete(
        req.params.id
      );
      res.json({ "Success":"Note has been deleted",note });
    } catch (e) {
      console.log(e.message);
      res.status(500).send("Internal server error");
    }
  });
module.exports = router;

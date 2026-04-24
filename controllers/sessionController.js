const Session = require("../models/Session");
const Question = require("../models/Question");


//@desc  creayte a new session and linked questions
//@route  POST/api/sessions/create
//access  Private

exports.createSession = async (req, res) =>{
    try{
      const {
        role,
        experience,
        topicToFocus,
        topicsToFocus,
        description,
        question,
        questions,
      } = req.body;

      const topicValue = topicToFocus || topicsToFocus;
      const questionArray = question || questions;

      // Validate required fields
      if (!role || !experience || !topicValue) {
        return res.status(400).json({ success: false, message: "Role, experience, and topics are required" });
      }

      if (!questionArray || !Array.isArray(questionArray) || questionArray.length === 0) {
        return res.status(400).json({ success: false, message: "Questions array is required" });
      }
      
      const userId = req.user._id  //assuming you have a middleware setting req.user
      const session = await Session.create({
        user: userId,
        role,
        experience,
        topicToFocus: topicValue,
        description
      });

      const questionDocs = await Promise.all(
        questionArray.map(async (q) => {
            const questionDoc = await Question.create({
                session: session._id,
                question: q.question,
                answer: q.answer,
            });
            return questionDoc._id;
        })
      );

      session.question = questionDocs;
      await session.save();
      
      res.status(201).json({
        success: true,
        message: "Session created successfully",
        session
      });
    }
    catch(error){
        console.error("Error in createSession:", error);
        res.status(500).json({ success: false, message: "server error", error: error.message});
    }
}   

//@desc  get all the session for logged in user
//@route  GET/api/sessions/my-sessions
//access  Private

exports.getMySessions = async (req, res) =>{
    try{
      const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1})
      .populate("question");
      res.status(200).json({ success: true, sessions });
      }
    catch(error){
        console.error("Error in getMySessions:", error);
        res.status(500).json({ success: false, message: "server error", error: error.message });
    }
    
}

//@desc  get a session by id with populated questions
//@route  GET/api/sessions/:id
//access  Private

exports.getSessionById = async (req, res) =>{
    try{
      const sessions = await Session.findById(req.params.id)
      .populate({
        path: "question",
        options: { sort: { isPinned: -1, createdAt: 1}}
      })
      .exec();
      
      if (!sessions) {
        return res.status(404).json({ success: false, message: "Session not found" });
      }
      res.status(200).json({ success: true, session: sessions });
    }  
    catch(error){
        console.error("Error in deleteSession:", error);
        res.status(500).json({ success: false, message: "server error", error: error.message , error: error.message });
    }
}

//@desc  Delete a session and its questions
//@route   Delete /api/sessions/:id
//@access  Private

exports.deleteSession = async (req, res) =>{
    try{
      const session = await Session.findById(req.params.id);
      if (!session) {
        return res.status(404).json({ success: false, message: "Session not found" });
      }

      // Verify user owns this session
      if (session.user.toString() !== req.user.id) {
        return res.status(401).json({ success: false, message: "Not authorized to access this session" });
      }
      // first , delete all questions linked to this session
      await Question.deleteMany({ session: session._id});

      //then delete the session
      await session.deleteOne();

      res.status(200).json({ message: "session deleted successfully"})
    }  
    catch(error){
        res.status(500).json({ success: false, message: "server error"});
    }
}
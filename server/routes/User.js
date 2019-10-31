const multer = require('multer');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const path = require('path');
const fs = require('fs');

router.get('/:username', (req,res) => {
	const { username } = req.params;

	User.findOne({username})
		.then(user => 
			user 
				? res.status(200).json({code: 200, response: user})
				: res.status(404).json({code: 404, response: 'User not found'}))
		.catch(e => res.send(500).json({error: 'There were an error.'}));

});

router.get('/:username/posts', (req,res) => {
	const { username: profile } = req.params;
	const { offset = 0, quantity = 20 } = req.query;

	Post.find({profile})			
		.skip(parseInt(offset))
		.limit(parseInt(quantity))
		.sort('-createdAt')
		.populate('author')
		.exec((err, posts) => {
			if(err)
				return res.status(500).send("There were an error")
			res.status(200).json({
				code: 200,
				response: posts
			})
		});
})

router.post('/:username/new/post', (req,res) => {
	const { username: profile } = req.params;
	const { message } = req.body;
	const { _id: author } = req.user;

	new Post({ author, profile, message })
		.save()
		.then(newPost => {
			Post.populate(newPost, {path: 'author'}, (err, populatedPost) => {
				res.status(200).json({
					code: 200,
					response: populatedPost
				})
			})			
		})
		.catch(e => res.status(500).send("There were an error"));
});

router.post('/:username/delete/post', (req,res) => {
	const { username: profile } = req.params;
	const { postId } = req.body;
	const { _id: authorId,username } = req.user;
	Post.findById(postId)
		.then(post => {
			if(authorId == post.author || username == post.profile){
				Post.findByIdAndRemove(post._id)
					.then(removedPost => res.status(200).json({
						code: 200,
						response: post
					}))
			}
			else{
				res.status(500).send("This isn't your post.")
			}
		})
		.catch(e => res.status(500).send("There were an error"));
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/avatars')
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.username}_${Date.now()}.png`);
  }
})

const upload = multer({storage: storage});

router.post('/:username/edit/info/profilePicture', upload.single('newImage'), (req,res, next) => {
	const { username } = req.params;

	if(!req.file)
		res.status(500).json(
			{
				code: 500,
				response: "There were an error"
			}
		);

	User.findOneAndUpdate({ username }, { profilePic: `images/avatars/${req.file.filename}` }, { new: true, useFindAndModify: false })
		.then(updatedUser => {
			res.status(200).json(
				{
					code: 200,
					response: {
						message: 'Foto cambiada con exito',
						path: updatedUser.profilePic,
						updatedUser
					}
				}
			)
		})
		.catch(e => res.status(500).send(e));
})

module.exports = router;
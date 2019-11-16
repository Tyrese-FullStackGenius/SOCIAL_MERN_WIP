const express = require('express');
const mongoose = require('./db/mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const { SECRET_KEY } = require('./config');
const app = express();
const PORT = 3000;
const AuthRoutes = require('./routes/Auth');
const PostRoutes = require('./routes/Post');
const UserRoutes = require('./routes/User');
const DiscoverRoutes = require('./routes/Discover');

app.use(cors());
app.use(methodOverride());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, 'public')));


app.use((req,res,next) => {
	const token = req.header('auth_token');

	if(token) {
		jwt.verify(token, SECRET_KEY, (err, decoded) => {
			if(err)
				return console.log(err);

			req.user = decoded.data;
		})
	}

	next();
});

app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);
app.use('/discover', DiscoverRoutes);
app.use('/post', PostRoutes);

app.listen(PORT, () => {
	console.log(`beep-booping on PORT ${PORT}`)
});

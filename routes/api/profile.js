const express = require('express');
const router = express.Router();
const request = require('request');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User = require('../../models/User');
const config = require('config');

// @route    GET api/profile/me
// @desc     get current user profile
//@access    Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res
                .status(400)
                .json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/profile
// @desc     Create or update user profile
//@access    Private

router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body;
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills
                .split(',')
                .map((skill) => skill.trim());
        }

        //social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({
                user: req.user.id,
            });

            if (profile) {
                //updating existing profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile);
            }
            //creating new profile
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/profile
// @desc     Get all profiles
//@access    Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar',
        ]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profiles by user ID
//@access    Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }

        res.json(profile);
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/profile
// @desc     Delete profile,user and posts
//@access    Private

router.delete('/', auth, async (req, res) => {
    try {
        //deleting Posts
        await Post.deleteMany({ user: req.user.id });
        //deleting Profile
        await Profile.findOneAndRemove({ user: req.user.id });

        //deleting User
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User Deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    Put api/profile/experience
// @desc     Adding experience in profile
// @access   Private

router.put('/experience', [
    auth,
    [
        check('title', 'Title is requried').not().isEmpty(),
        check('company', 'Company is requried').not().isEmpty(),
        check('from', 'From date is requried').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },
]);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Deleting experience in profile
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get remove index
        const removeIndex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    Put api/profile/education
// @desc     Adding education in profile
// @access   Private

router.put('/education', [
    auth,
    [
        check('school', 'School is requried').not().isEmpty(),
        check('degree', 'Degree is requried').not().isEmpty(),
        check('fieldofstudy', 'Field of Study is requried').not().isEmpty(),
        check('from', 'From date is requried').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;

        const newExp = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },
]);

// @route    DELETE api/profile/education/:exp_id
// @desc     Deleting education in profile
// @access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get remove index
        const removeIndex = profile.education
            .map((item) => item.id)
            .indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile/github/:username
// @desc     Get gihub repositories
// @access   Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
            )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' },
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'Github user not found' });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

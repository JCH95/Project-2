const router = require('express').Router();
const sequelize = require('../config/connection'); // using sequlize which is ORM. This brings in the data.  
const { Users, Organization } = require('../models'); // schema for the data and tables
const withAuth = require('../utils/auth');

// // get all users for homepage
// router.get('/', withAuth, (req, res) => {
//     console.log('======================');
//     Users.findAll({
//         where: {
//             user_id: req.session.user_id
//         },
//         attributes: [
//             'id', 'username', 'email', 'is_Host', 'password', 'wins', 'losses', 'elo',
//         ],
//         // include: {
//         //     model: Organization,
//         //     attributes: ['id', 'name']
//         // }
//     })
//         .then(dbUserData => {
//             const users = dbUserData.map(user => user.get({ plain: true }));
//             res.render('homepage', {
//                 users, 
//                 loggedIn: req.session.loggedIn 
//             });
//         })
// });


// get all users for homepage and added withAuth to verify login. 
router.get('/', withAuth, (req, res) => {
    console.log('======================');
    console.log(req.session);
    // req.session.username = dbUserData.username;
    // req.session.wins = dbUserData.wins;
    // req.session.losses = dbUserData.losses;
    // req.session.elo = dbUserData.elo;
    // req.session.loggedIn = true;)

    // This is to get all user information!!!!!
    Users.findAll({
        // where: { // hopefully this gets the user id for the specific user's data
        //     user_id: req.session.user_id
        // },
        attributes: [
            'id',
            'username',
            'email',
            'wins',
            'losses',
            'elo'
        ]
    })
        .then(dbUserData => {
            const users = dbUserData.map(user => user.get({ plain: true }));
            res.render('homepage', { users, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});



// get single post and comments 
router.get('/user/:id', (req, res) => {
    Users.findOne({
        where: {
            id: req.params.id
        }, attributes: [
            'id',
            'username',
            'email',
            'wins',
            'losses',
            'elo'
        ],
        include: [
            {
                model: Organization,
                attributes: ['id', 'name'],
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }

            const user = dbUserData.get({ plain: true });

            res.render('single-post', {
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Login Page load up
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/homepage');
        return;
    }
    res.render('login');
});

module.exports = router;

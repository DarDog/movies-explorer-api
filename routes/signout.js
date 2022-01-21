const router = require('express')
  .Router();

router.get('/signout', (req, res) => {
  res.status(200)
    .clearCookie('jwt', {
      sameSite: 'None',
      secure: true,
    })
    .end();
});

module.exports = router;

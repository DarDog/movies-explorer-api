const router = require('express')
  .Router();

router.get('/signout', (req, res) => {
  res.status(200)
    .clearCookie('jwt', {})
    .end();
});

module.exports = router;

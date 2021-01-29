/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:52
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-29 13:10:17
 */
const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/users' })
const {
  getUserList,
  getUserInfo,
  getUserInfoByToken,
  createUser,
  updateUserInfo,
  deleteUser,
  login,
  interestList,
  fanList,
  follow,
  unFollow,
  updatePassword,
  followerTopic,
  unFollowerTopic,
  followerTopicList,
  questionsList,
  likeAnswer,
  unLikeAnswer,
  dislikeAnswer,
  unDislikeAnswer,
  likeAnswerList,
  dislikeAnswerList,
  collectAnswerList,
  collectAnswer,
  unCollectAnswer,
  focusQuestionList,
  focusQuestion,
  unFocusQuestion,
  columnsList,
  articlesList
} = require('../controllers/users')
const { checkOwner, checkUserExist } = require('../middlewares/users')
const { secret } = require('../config')

/**
 * 使用koa-jwt实现验证token
 */
const auth = jwt({ secret })

router.post('/getUserList', getUserList)
router.post('/createUser', createUser)
router.post('/getUserInfo', getUserInfo)
router.post('/getUserInfoByToken', auth, getUserInfoByToken)
router.post('/updateUserInfo', auth, checkOwner, updateUserInfo)
router.post('/deleteUser', auth, checkOwner, deleteUser)
router.post('/login', login)
router.post('/interestList', interestList)
router.post('/fanList', fanList)
router.post('/follow', auth, checkUserExist, follow)
router.post('/unFollow', auth, checkUserExist, unFollow)
router.post('/updatePassword', auth, checkOwner, updatePassword)
router.post('/followerTopic', auth, followerTopic)
router.post('/unFollowerTopic', auth, unFollowerTopic)
router.post('/followerTopicList', followerTopicList)
router.post('/questionsList', questionsList)
router.post('/likeAnswerList', likeAnswerList)
router.post('/dislikeAnswerList', dislikeAnswerList)
router.post('/likeAnswer', auth, likeAnswer, unDislikeAnswer)
router.post('/unLikeAnswer', auth, unLikeAnswer)
router.post('/dislikeAnswer', auth, dislikeAnswer, unLikeAnswer)
router.post('/unDislikeAnswer', auth, unDislikeAnswer)
router.post('/collectAnswerList', collectAnswerList)
router.post('/collectAnswer', auth, collectAnswer)
router.post('/unCollectAnswer', auth, unCollectAnswer)
router.post('/focusQuestionList', focusQuestionList)
router.post('/focusQuestion', auth, focusQuestion)
router.post('/unFocusQuestion', auth, unFocusQuestion)
router.post('/columnsList', columnsList)
router.post('/articlesList', articlesList)

module.exports = router

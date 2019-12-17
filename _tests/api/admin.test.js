const server = require('../server')
const {nickname, email, password} = require('../utils')

let token = ''

test('测试管理员注册，按正确的发送参数，测试结果应该注册成功', async () => {
  const res = await server.post('/api/v1/admin/register').send({
    nickname,
    email,
    password1: password,
    password2: password
  })
  expect(res.status).toBe(200)
})

test('测试管理员注册，输入不正确的邮箱进行注册，测试结果应该注册失败', async () => {
  const res = await server.post('/api/v1/admin/register').send({
    nickname,
    email: `not a mail@m`,
    password1: password,
    password2: password
  })
  expect(res.status).toBe(400)
})


test('测试管理员注册，输入两次密码不正确，测试结果注册失败', async () => {
  const res = await server.post('/api/v1/admin/register').send({
    nickname,
    email,
    password1: password,
    password2: password + '1024'
  })
  expect(res.status).toBe(400)
})


test('测试管理员登录，使用正确的邮箱和密码，测试结果应该登录成功', async () => {
  const res = await server.post('/api/v1/admin/login').send({
    email,
    password
  })
  token = res.body.token
  expect(res.status).toBe(200);
  expect(res.body.msg).toBe('登录成功');
})

test('测试管理员登录，使用正确的邮箱和错误密码，测试结果应该登录失败', async () => {
  const res = await server.post('/api/v1/admin/login').send({
    email,
    password: password + '1024'
  })
  expect(res.status).toBe(401);
})

test('测试管理员登录，使用不同的的邮箱和正确密码，测试结果应该登录失败', async () => {
  const res = await server.post('/api/v1/admin/login').send({
    email: '1024' + email,
    password: password
  })
  expect(res.status).toBe(401);
  expect(res.body.msg).toBe('账号不存在或者密码不正确');
})

test('测试登录，使用不正确的邮箱和正确的密码，测试结果应该登录失败', async () => {
  const res = await server.post('/api/v1/admin/login').send({
    email: email + '1024',
    password
  })
  expect(res.status).toBe(400);
})

test('测试使用正确的 token 获取管理员信息，测试结果应该成功', async () => {
  const res = await server.get('/api/v1/admin/auth').auth(token, { type: "basic" })
  expect(res.status).toBe(200)
  expect(res.body.data.nickname).toBe(nickname)
  expect(res.body.data.email).toBe(email)
  expect(res.body.data.password).toBe(undefined)
})

test('测试使用错误的 token 获取管理员信息，测试结果应该错误', async () => {
  const res = await server.get('/api/v1/admin/auth').auth(token + '11', { type: "basic" })
  expect(res.status).toBe(403)
})

test('测试使用过期的 token 获取管理员信息，测试结果应该错误', async () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInNjb3BlIjoxNiwiaWF0IjoxNTc2NDEyMTc2LCJleHAiOjE1NzY0MTU3NzZ9.hoMfvuMsa3Bfyb0Y_p9CESnB_gRk6dARpIRibxpKiq8'
  const res = await server.get('/api/v1/admin/auth').auth(token, { type: "basic" })
  expect(res.status).toBe(403)
})


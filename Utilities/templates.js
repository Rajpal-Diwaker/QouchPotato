
var mailTemplate = {
	from: "Qouch Potato<test.techugo@gmail.com>",
	subject:"Qouch Potato Forgot Password",
	text:"Hi user,<br><br>Please follow the link to recover the password.<a target='_blank' href='http://13.126.131.184:4001/user/verifyForgotLink?email={{email}}&forgot_token={{forgot_token}}'>Recover Password</a><br><br>Thanks,<br>Team Qouch Potato."
}
module.exports ={
	mailTemplate : mailTemplate
}
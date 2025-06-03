import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import router from './router/v1.js';
import AppError from './config/appError.js';
import { constant } from './config/constants.js';
import em from './event/generic.event.js';
import Webhook from './model/webhook.model.js';
// import moJwt from 'jwt-connector';
// import fs from 'fs';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public/build')));
app.use(express.static(path.join(__dirname, 'assets')));

// const miniOrangeSSOURL = "https://login.xecurify.com/moas/broker/login/jwt/299372?client_id=wHGqUC46Ve9tLpkZ&redirect_uri=https://bookb.the-algo.com";
// // const miniOrangeSSOURL = "https://bookb.xecurify.com/moas/broker/login/jwt/299372?client_id=wHGqUC46Ve9tLpkZ&redirect_uri=http://localhost:9191/token"
// // const miniOrangeSSOURL = "https://login.xecurify.com/moas/broker/login/jwt/299372?client_id=wHGqUC46Ve9tLpkZ&redirect_uri=http://localhost:9191"
// // "https://jsdemo.xecurify.com/moas/broker/login/jwt/258267?client_id=lXN6XGc1yoh8M6Gd&redirect_uri=http://localhost:3000/auth/callback";
// // start authentication request
// app.get("/auth", (req, res, next) => {
// 	res.redirect(miniOrangeSSOURL);
// });

// authentication callback
// app.get('/token', (req, res, next) => {
// 	try {
// 		var id_token = req.query.id_token;
// 		var cert = fs.readFileSync("../jwt-connector/RSA256Cert.crt", 'utf8');

// 		var jwtBuilder = new moJwt.JWTBuilder(); 
// 		jwtBuilder.parseJwt(id_token); // initialize the token using parseJwt  

// 		jwtBuilder.setSecret("-----BEGIN CERTIFICATE-----" +
// 			"MIID/zCCAuegAwIBAgIJAPmPOnjOfbO/MA0GCSqGSIb3DQEBCwUAMIGVMQswCQYD" +
// 			"VQQGEwJJTjEUMBIGA1UECAwLTUFIQVJBU0hUUkExDTALBgNVBAcMBFBVTkUxEzAR" +
// 			"BgNVBAoMCk1JTklPUkFOR0UxEzARBgNVBAsMCk1JTklPUkFOR0UxEzARBgNVBAMM" +
// 			"Ck1JTklPUkFOR0UxIjAgBgkqhkiG9w0BCQEWE2luZm9AbWluaW9yYW5nZS5jb20w" +
// 			"HhcNMTYwMTMwMDgyMzE0WhcNMjYwMTI3MDgyMzE0WjCBlTELMAkGA1UEBhMCSU4x" +
// 			"FDASBgNVBAgMC01BSEFSQVNIVFJBMQ0wCwYDVQQHDARQVU5FMRMwEQYDVQQKDApN" +
// 			"SU5JT1JBTkdFMRMwEQYDVQQLDApNSU5JT1JBTkdFMRMwEQYDVQQDDApNSU5JT1JB" +
// 			"TkdFMSIwIAYJKoZIhvcNAQkBFhNpbmZvQG1pbmlvcmFuZ2UuY29tMIIBIjANBgkq" +
// 			"hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsSKksJcuQbZm/cw67JJkHvlzrzd3+aPL" +
// 			"hfqy/FCKj/BmZ7mBZf0s3+89O0rOamsZP1NKzOE29ZL6ONLJHxU48LUbGciZupm/" +
// 			"wf7dY/Av34uDcZ61ufKz0u17UTxgjLULIWBy//68EOr4Xbm/4bqhmKcB3CclMaom" +
// 			"0LWeCrqittiLqunVCjFIbxXMT010WiBBnFwqjUqfuMnVLL+HrPPqgPqNhiKDdxBx" +
// 			"Hk9GDPq2+GEruM1jw7TUjVa+zbhekvdNTbj2Fo2sqf+mIkFLSaS6cHg0UeL7sX0w" +
// 			"vQFDMwx+hpfRLMcYpFAmRMn3dI2zUnPgwvWeKHrnNOjHVkRTV4hgZQIDAQABo1Aw" +
// 			"TjAdBgNVHQ4EFgQU85bt1wVl/f2LftBu1jeO499VUbYwHwYDVR0jBBgwFoAU85bt" +
// 			"1wVl/f2LftBu1jeO499VUbYwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOC" +
// 			"AQEApenCY36LGThXLAIRIvDQ6XnHELL7Wm53m3tHy+GA2MxUbcTqQC3tgXM+yC18" +
// 			"EstjRHgWdQMtOcq9ohb5/TqWPoYAYnbg1SG9jEHJ3LLaIMI0idYo+zfPCtwliHLn" +
// 			"suZXH6ZU3mh/IQEBqINini6R/cSh9BpIjqwXKpjWoegl9XLI/RQ7Bbbya89TUBwm" +
// 			"5KR3deWXdMZEj/d7hV8XdSWyi2CvWTeHIfkZVhcHg1ues9+Mt3kaBr4Z5/NkQPAN" +
// 			"jfMdKjZ8tfNTN7PgYAYyRW6C8aXcw+w0zIoGrcO2gVM9/3oR4gHm5MUHOMdAyONk" +
// 			"g59+T+7NDlN7y4YmVIZQBgHByA==" +
// 			"-----END CERTIFICATE-----"); // Set the certificate downloaded from miniOrange dashboard

// 		var verified = jwtBuilder.verifyJwt(); // Verify the signed token

// 		if (!verified) res.send("Error Occurred while verifying JWT Token");

// 		var payload = jwtBuilder.getPayload(); // If the token is valid, use getPayload to read the data from the token.
// 		// var firstname = payload.first_name;
// 		// var lastname = payload.last_name;
// 		// var email = payload.email;

// 		res.send({
// 			token: id_token,
// 			payload: payload
// 		});

// 	} catch (error) {
// 		res.send({ error: error, id_token: id_token });
// 	}
// });

app.use('/share', function (req, res, next) {
	if (((req.headers['user-agent']).includes('Android')) || ((req.headers['user-agent']).includes('Windows'))) {
		return res.redirect(constant.playStoreURL)
	}
	// if contains Iphone or Macintosh, redirect to App store
	else if (((req.headers['user-agent']).includes('iPhone') || (req.headers['user-agent']).includes('Macintosh'))) {
		return res.redirect(constant.appStoreURL)
	}
	else {
		return res.redirect(constant.playStoreURL)
	}
})

// app.get('/', (req, res) => {
// 	res.send('Hello!! This is salon API!');
// });
app.post('/test-result-si', express.raw({ type: 'application/json' }),async function (req, res) {
	await Webhook.create({
        request:req.body
    })
	return res.json({
		data: "API Hitting"
	})
})
app.get('/test-result-si', async function (req, res) {
	const result = await Webhook.find({}).sort({ createdAt: -1 })
	return res.json({
		data: "api result",
		result
	})
})
app.use('/api/v1', router);

app.use(function (req, res, next) {
	next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});


// update subscrition of salon
// cron.schedule("0 */12 * * *", async function () {
// 	console.log("RUN check subscritition plan validity" + new Date());
// 	//commented for staging only  
// 	await emailEvent.emit('update-subscrtion', {})
// }, {
// 	scheduled: true,
// }, err => {
// 	console.log(err);
// });

// error handler 
app.use(function (err, req, res, next) {
	console.log(err);
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	if (err.message === 'jwt expired' || err.message === 'invalid signature' || err.code === 'credentials_required') {
		return res.status(200).json({
			status: false,
			message: 'Your token has expired. Please log in again!',
			code: err.code ? err.code : 'credentials_required',
		});
	} else {
		return res.status(200).json({
			status: false,
			message: err.message
		});
	}
});

export default app;

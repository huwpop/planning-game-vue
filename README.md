`docker build . -f ./Dockerfile -t planning-game`
`docker run -e HOSTURL='<ngrok or cloudflare tunnel url>' -p 0.0.0.0:<local exposed tunnel port>:3000 planning-game`

e.g. For ngrok

`./ngrok http 8089`

Tunnel services:

https://developers.cloudflare.com/pages/how-to/preview-with-cloudflare-tunnel/

https://ngrok.com/

https://c5a0-86-158-67-196.ngrok.io

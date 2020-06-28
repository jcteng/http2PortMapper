const http2 = require('http2');
const net = require("net")
const url = require('url');

const server = http2.createServer()

server.on("error", (e)=>console.error("server error",e))


server.on("stream", (stream, header) => {

    if (header[":path"].startsWith("/tcp://")) {
        let targetInfo = url.parse(header[":path"].slice(1))
        let upstream = net.connect({ port: targetInfo.port, host: targetInfo.hostname })
        console.log("connect>", targetInfo.hostname, targetInfo.port)

        stream.pipe(upstream).pipe(stream)
        onError = (err) => {
            console.log(err)
            stream.destroy()
            upstream.destroy()
        }
        stream.on("error", onError)
        upstream.on("error", onError)
        stream.on("close", ()=>{
            onError("stream close")
        })
        upstream.on("close", ()=>{
            onError("upstream close")
        })
       
    }
}).listen(1443, "0.0.0.0", () => {
    console.log("server listen on ", server.address())

})




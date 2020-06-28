const net = require("net")
const http2 = require("http2")

const remoteURL = "http://127.0.0.1:1443"
const targetURL = "tcp://127.0.0.1:22"

let tcpPortMapper = net.createServer(async (stream)=>{
    
    let h2c = http2.connect(remoteURL,()=>{


        h2c.on("error",console.error)
        
        const upstream = h2c.request({ ':path': '/'+targetURL },{endStream:false})        
        stream.pipe(upstream).pipe(stream)
    
        onError=(err)=>{
            console.log(err)
            stream.destroy()
            upstream.destroy()
        }
        stream.on("error",onError)
        upstream.on("error",onError)
        stream.on("close", ()=>onError("stream close"))
        upstream.on("close", ()=>onError("upstream close"))
       

    })    
    
}).listen(12222,()=>{
    console.log("tcpPortMapper listen on ",tcpPortMapper.address())
})


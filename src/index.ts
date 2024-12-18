import { WebSocketServer } from "ws";

const webserver=new WebSocketServer({port:4000});
let Totalusers=0;
let userArray=[{}];

webserver.on("connection",(socket)=>{
   Totalusers++;
   console.log("user connected "+Totalusers);
   
   socket.on("message",(message)=>{
       
       //@ts-ignore
       const ConvertIntoObject=JSON.parse(message);

       if(ConvertIntoObject.type==="join"){
        const RoomWantToJoin=ConvertIntoObject.roomNo;
        if(!userArray.includes(RoomWantToJoin)){
            socket.send("Room Don't Exists!!!")
            return;
        } else{
            userArray.push({
                socket:socket,
                roomNo:ConvertIntoObject.roomNo
            })
        }
        console.log(RoomWantToJoin);
       }

       if(ConvertIntoObject.type==="leave"){
        //@ts-ignore
        userArray.pop(socket)
       }


       if(ConvertIntoObject.type==="show"){
          let arr:Number[]=[];
          for(let i=0;i<userArray.length;i++){
            //@ts-ignore
         if(!arr.includes(userArray[i].roomNo))  arr.push(userArray[i].roomNo)
          }
      socket.send(JSON.stringify(arr))
   console.log(arr)
        }
        
        
        if(ConvertIntoObject.type==="create"){
            userArray.push({
                socket:socket,
                roomNo:ConvertIntoObject.roomNo
            })
            console.log(userArray)
    } else{
        const MessageToBeForwardToOtherUsers=ConvertIntoObject.message;

        let CurrentUserRoomNo=null;

        for(let i=0;i<userArray.length;i++){
            //@ts-ignore
            if(userArray[i].socket===socket){
                            //@ts-ignore
              CurrentUserRoomNo=userArray[i].roomNo;
            }
        }

        for(let i=0;i<userArray.length;i++){
            //@ts-ignore
            if(userArray[i].roomNo===CurrentUserRoomNo && userArray[i].socket!=socket){
                //@ts-ignore
                userArray[i].socket.send(MessageToBeForwardToOtherUsers)
            }
        }
    }
   })
})
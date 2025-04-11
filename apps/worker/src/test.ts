// const created_At = new Date(Date.now()).toLocaleString("en-IN", {
//   timeZone: "Asia/Kolkata",
// });
// console.log(created_At)

function main(){
    for(let i = 0; i < 10; i++){
        if(i === 3){
            return
        }
        console.log(i)
    }
}
main()
document.getElementById('text').addEventListener('change',e=>{
    let check=e.target.value;
    sendMessage(check);
});
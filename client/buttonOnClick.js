document.getElementById('text').addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            sendMessage(event.target.value);
            document.getElementById('text').value = '';
        }

    // console.log(e);
    // if (e.keyCode == 13) {
    //     let check=e.target.value;
    //     sendMessage(check);
    // }
});
var firebaseObject = new Firebase('https://fir-chat-app-1ba59.firebaseio.com/');
var userInput = document.querySelector('#user');
var messageInput = document.querySelector('#message');
var sendButton = document.querySelector('#send');

//listen for click from send button
sendButton.addEventListener("click", function(){
	var messageUser = userInput.value;
	var messageText = messageInput.value;
	alert(messageUser + messageText);
	firebaseObject.set(messageUser + ": " + messageText);
	messageText.value = "";
});
var firebaseRef = firebase.database().ref();
//var userInput = document.querySelector('#userLogin');
var messageInput = document.querySelector('#message');
var sendButton = document.querySelector('#send');
var messageList = document.querySelector("#messageList");
var googleProvider = new firebase.auth.GoogleAuthProvider(); //instance of google provider object
var googleUser = null;
var userSignedIn = false;
var signinButton = document.querySelector("#userLogin");

//textarea and send button start disabled until user signs in
messageInput.disabled = true;
sendButton.disabled = true;

//displays new messages
var updateChat = function(){
	firebaseRef.on('child_added',function(snapshot){
		var message = snapshot.val();

		var messageUserElement = document.createElement("b");
		messageUserElement.textContent = message.user + ": ";
		messageUserElement.className = "message-element";

		var messageTextElement = document.createElement("p");
		messageTextElement.textContent = message.text;
		messageTextElement.className = "message-element";

		var messageContainerElement = document.createElement("div");
		messageContainerElement.appendChild(messageUserElement);
		messageContainerElement.appendChild(messageTextElement);
		messageContainerElement.className = "message-container";
		document.querySelector("#messageList").appendChild(messageContainerElement);
		messageList.scrollTop = messageList.scrollHeight; //auto scrolls the chat 
	});
}
//sign-in button
signinButton.addEventListener("click", function(){
	firebase.auth().signInWithPopup(googleProvider).then(function(result){
		var token = result.credential.accessToken;
		var user = result.user;
		googleUser = user.displayName;
		userSignedIn = true;
		updateChat();

		signinButton.textContent = "Signed in as " + googleUser;
		signinButton.disabled = true;
		messageInput.disabled = false;
		messageInput.placeholder = "Type your message..."
		sendButton.disabled = false;

	}).catch(function(error){
		var errorCode = error.code;
		var errorMessage = error.message;
		alert("This was an error signing you in. Error Code: " + errorCode + ". Error Message: " + errorMessage);
		console.log(errorCode + "/ " + errorMessage);
	});
})


//send button
sendButton.addEventListener("click", function(){
	var messageUser = googleUser;
	var messageText = messageInput.value;
	firebaseRef.push({user:messageUser, text:messageText});
	messageInput.value = "";

});

//execute when page is closed or refreshed
window.onbeforeunload = function(){
	firebase.auth().signOut().then(function(){
		//Sign out successful, do nothing.
		userSignedIn = false;
 	}).catch(function(error){
 		alert("There was an error with signing you out.");
 		console.log(error);
 	});
}

//call updateChat function if user has logged in
if(userSignedIn){
	updateChat();
}
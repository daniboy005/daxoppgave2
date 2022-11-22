const countersection = document.querySelector('#countersection');
const counter = document.querySelector('#counter');
const loginForm = document.querySelector('#loginform');
const logoutlink = document.querySelector('#logout');
const counterDoc = db.collection('counters').doc('xoMStrbtGnOV0Su2gjUK');
let username = null;

let localCounter = 'X';

//listener for the counterdocument. All updates are relayed to the
//counter element.
counterDoc.onSnapshot(snapshot => {
    localCounter = snapshot.data().count;
    counter.innerText = localCounter;
});

//listener for the logout form. Listens for keypresses, especially 'Enter'
loginForm.addEventListener('keypress', event => {
    if(event.key === 'Enter' && loginForm['username'].value.length > 5 && loginForm['password'].value.length > 5){
        login(loginForm['username'].value);
    }
});

//listener for the logout link that calls the logout function
logoutlink.addEventListener('click', e => {
    logout();
});


//Event listener fire the + and - that affects the counter.
//updates the counter document.
countersection.addEventListener('click', e => {
    e.preventDefault();
    const emitter = e.target.textContent;

    switch(emitter){
        case '+':
            counterDoc.update('count', ++localCounter);
            break;
        case '-':
            if(localCounter > 0) counterDoc.update('count', --localCounter);
            break;
        default:
            break;
    }
});

//The loginfunction checks if a user exists in the database.
//If a user exists, the login element is hidden and the counter element is displayed
//if a user does not exist, the user is informed through a warning.
function login(inputuser){
    db.collection('users').where('username','==', inputuser).get()
    .then(result => {
        if(result.docs.length === 1){
            const user = result.docs[0].data();
            if(user.password === loginForm['password'].value){ 
                username = user.username; 
                console.log(user.username, username)  
                renderCounter();
            } else {
                setWarning();
            }
        } else if(result.docs.length === 0) {
            setWarning();
        }

        function setWarning() {
            const feedback = document.querySelector('#feedback');
                feedback.innerText = 'invalid userdata, please try again!';
                feedback.classList.toggle('hidden');

                //show message for 5 seconds
                setTimeout(()=>{
                    feedback.classList.toggle('hidden');
                },5000)
        }
    }).catch(err => console.log(err));
}

//clears the username variable, shows the loginform and hides the counter
function logout(){
    username = null;
    loginForm.classList.toggle('hidden');
    countersection.classList.toggle('hidden');
}

//shows the counter, hides the loginform and clears the fields of the loginform.
function renderCounter(){
    loginForm.classList.toggle('hidden');
    countersection.classList.toggle('hidden');
    loginForm['username'].value = "";
    loginForm['password'].value = "";
    document.querySelector('#username').innerText = username;
}
class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
        this.flag=true;
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        this.toggleState(chatBox)
        var audio = new sound('../static/images/pop.mp3');
        audio.play();

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
        
        console.log('flag',this.flag);
        if(this.flag){
            var textField = chatbox.querySelector('input');
            let msg2 = { name: "start", message: "Hi there, what can I do for you?" };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''
            this.flag=false;
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://localhost:8000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "ipw", message: r.data };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    optionButton(domain)   {
        console.log('option clicked',domain);
        document.querySelectorAll('.optionButton').forEach(el => el.setAttribute('disabled', true));

        fetch('http://localhost:8000/domain', {
            method: 'POST',
            body: JSON.stringify({ message: domain }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "domain", message: r.data , selected:domain };
            this.messages.push(msg2);
            this.updateChatText(this.args.chatBox)
            //textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(this.args.chatBox)
            //textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "ipw")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            }
            else if(item.name === "start")
            {
                // html += '<div style="display:inline">'
                // html += '<button class="messages__item messages__options--visitor optionButton" onclick="optionClicked(\'HR Queries\')" style="text-decoration:none;margin-right:8px;"> HR Queries </button>';
                // html += '<button class="messages__item messages__options--visitor optionButton" onclick="optionClicked(\'Sam\')" style="text-decoration:none;margin-right:8px;"> SAM </button>';
                // html += '<button class="messages__item messages__options--visitor optionButton" onclick="optionClicked(\'Svr\')" style="text-decoration:none;margin-right:8px;"> SVR </button>';
                // html += '<button class="messages__item messages__options--visitor optionButton" onclick="optionClicked(\'Ipw\')" style="text-decoration:none;margin-right:8px;"> IPW </button>';
                // html += '</div>'
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';

            }
            else if(item.name === "domain")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
                html += '<div class="messages__item messages__item--operator">' + item.selected + '</div>';
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

function optionClicked(domain){
    chatbox.optionButton(domain);
}

const chatbox = new Chatbox();
chatbox.display();

//Visitor is Bot, Operator is User